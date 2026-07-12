import React, { useState, useEffect } from 'react';
import ComprehensibleInput from './ComprehensibleInput';
import SpacedRepetition from './SpacedRepetition';
import Shadowing from './Shadowing';
import QuickOutput from './QuickOutput';
import FlowCompletion from './FlowCompletion';

export default function DailyFlowContainer({ onResetProfile }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySession();
  }, []);

  const fetchTodaySession = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/flow-session/today");
      if (res.ok) {
        const data = await res.json();
        setSessionData(data);
        
        // Start from whatever step they left off
        const step = data.stepsCompleted || 0;
        setCurrentStep(Math.min(step + 1, 5));
      }
    } catch (err) {
      console.error("Error loading session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async () => {
    // Determine which API field to update
    let updateField = {};
    if (currentStep === 1) updateField = { comprehensible_input_completed: true };
    else if (currentStep === 2) updateField = { srs_completed: true };
    else if (currentStep === 3) updateField = { shadowing_completed: true };
    else if (currentStep === 4) updateField = { output_completed: true };

    try {
      await fetch("http://localhost:8000/api/flow-session/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateField)
      });
    } catch (err) {
      console.error("Failed to sync step completion:", err);
    }

    setCurrentStep(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="logo" style={{ fontSize: '2.5rem', animation: 'float 2s ease-in-out infinite' }}>🌊</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '1.5rem', fontSize: '1.2rem' }}>Loading Today's Flow...</h2>
      </div>
    );
  }

  if (!sessionData || !sessionData.story) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Setup Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Please complete your onboarding profile to generate your first session.
        </p>
        <button className="btn btn-primary" onClick={onResetProfile}>
          Go to Onboarding
        </button>
      </div>
    );
  }

  // Visual highlights helper for steps Completed/Active
  const stepCompleted = (stepIndex) => currentStep > stepIndex;
  const stepActive = (stepIndex) => currentStep === stepIndex;

  return (
    <div style={{ width: '100%' }}>
      {/* Progress Tracker */}
      {currentStep < 5 && (
        <div className="flow-progress" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className={`progress-step ${stepActive(1) ? 'active' : ''} ${stepCompleted(1) ? 'completed' : ''}`}>
            <div className="step-indicator">1</div>
            <div className="step-label">Input</div>
          </div>
          <div className={`progress-step ${stepActive(2) ? 'active' : ''} ${stepCompleted(2) ? 'completed' : ''}`}>
            <div className="step-indicator">2</div>
            <div className="step-label">SRS</div>
          </div>
          <div className={`progress-step ${stepActive(3) ? 'active' : ''} ${stepCompleted(3) ? 'completed' : ''}`}>
            <div className="step-indicator">3</div>
            <div className="step-label">Shadow</div>
          </div>
          <div className={`progress-step ${stepActive(4) ? 'active' : ''} ${stepCompleted(4) ? 'completed' : ''}`}>
            <div className="step-indicator">4</div>
            <div className="step-label">Output</div>
          </div>
        </div>
      )}

      {/* Switch Screens based on Active Step */}
      {currentStep === 1 && (
        <ComprehensibleInput onComplete={handleStepComplete} />
      )}
      
      {currentStep === 2 && (
        <SpacedRepetition onComplete={handleStepComplete} />
      )}

      {currentStep === 3 && (
        <Shadowing onComplete={handleStepComplete} />
      )}

      {currentStep === 4 && (
        <QuickOutput onComplete={handleStepComplete} />
      )}

      {currentStep === 5 && (
        <FlowCompletion 
          streakCount={sessionData.streakCount} 
          shadowScore={sessionData.session?.shadowingScore}
          onRestart={fetchTodaySession} 
        />
      )}
    </div>
  );
}
