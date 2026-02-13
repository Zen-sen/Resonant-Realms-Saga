import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryDataPoint } from '../physics/telemetry';

/**
 * @fileoverview useExperiment Hook
 * Bridges the physics engine with React state via Web Worker for 60fps performance.
 * 
 * Philosophy: The Observer (player) controls voltage; the experiment responds with reality.
 */

export interface ExperimentState {
    voltage: number;              // Current voltage (V)
    telemetry: TelemetryDataPoint | null;
    isRunning: boolean;
    mintUnlocked: boolean;       // True if ≥30% lift achieved
    failedAttempts: number;      // Count of attempts <30% (Lessons Encoded)
    adversaryBuffer: number;     // Accumulated learning from failures
    history: TelemetryDataPoint[];
    vacuumMode: boolean;         // Current air density mode
}

export interface ExperimentControls {
    setVoltage: (voltage: number) => void;
    startExperiment: () => void;
    resetExperiment: () => void;
    recordFailedAttempt: () => void;
    setVacuumMode: (enabled: boolean) => void;
}

export function useExperiment(initialVacuum: boolean = false): [ExperimentState, ExperimentControls] {
    const [voltage, setVoltage] = useState(0);
    const [telemetry, setTelemetry] = useState<TelemetryDataPoint | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [mintUnlocked, setMintUnlocked] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [adversaryBuffer, setAdversaryBuffer] = useState(0);
    const [history, setHistory] = useState<TelemetryDataPoint[]>([]);
    const [vacuumMode, setVacuumMode] = useState(initialVacuum);

    const workerRef = useRef<Worker | null>(null);

    // Initialize Web Worker on mount
    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../workers/physics-worker.ts', import.meta.url),
            { type: 'module' }
        );

        // Listen for messages from worker
        workerRef.current.onmessage = (event) => {
            const { type, data } = event.data;

            switch (type) {
                case 'TELEMETRY_UPDATE':
                    setTelemetry(data.telemetry);
                    setHistory(prev => [...prev, data.telemetry]);

                    if (data.adversaryBuffer !== undefined) {
                        setAdversaryBuffer(data.adversaryBuffer);
                    }

                    // Check for 30% threshold
                    const liftPercent = (data.telemetry.variance / (data.telemetry.weight + data.telemetry.variance)) * 100;
                    if (liftPercent >= 30 && !mintUnlocked) {
                        setMintUnlocked(true);
                    }
                    break;

                case 'ADVERSARY_UPDATE':
                    setAdversaryBuffer(data.buffer);
                    break;
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, [mintUnlocked]); // Removed voltage to prevent recreation on every slider move

    // Send voltage updates to worker
    useEffect(() => {
        if (isRunning && workerRef.current) {
            workerRef.current.postMessage({
                type: 'UPDATE_VOLTAGE',
                voltage,
                vacuumMode
            });
        }
    }, [voltage, isRunning, vacuumMode]);

    const startExperiment = useCallback(() => {
        setIsRunning(true);
        setHistory([]);
        setMintUnlocked(false);

        workerRef.current?.postMessage({
            type: 'START_EXPERIMENT',
            vacuumMode
        });
    }, [vacuumMode]);

    const resetExperiment = useCallback(() => {
        setVoltage(0);
        setTelemetry(null);
        setIsRunning(false);
        setMintUnlocked(false);
        setHistory([]);

        workerRef.current?.postMessage({ type: 'RESET' });
    }, []);

    const recordFailedAttempt = useCallback(() => {
        setFailedAttempts(prev => prev + 1);
        setAdversaryBuffer(prev => prev + 5);
    }, []);

    const state: ExperimentState = {
        voltage,
        telemetry,
        isRunning,
        mintUnlocked,
        failedAttempts,
        adversaryBuffer,
        history,
        vacuumMode
    };

    const controls: ExperimentControls = {
        setVoltage,
        startExperiment,
        resetExperiment,
        recordFailedAttempt,
        setVacuumMode
    };

    return [state, controls];
}
