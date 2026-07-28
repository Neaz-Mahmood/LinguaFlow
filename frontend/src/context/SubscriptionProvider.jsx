import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchQuota, getToken } from '../lib/api';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [plan, setPlan] = useState('free');
  const [quota, setQuota] = useState({ practiceMinutesRemaining: 0, periodEnd: null });
  const [loaded, setLoaded] = useState(false);

  const refreshQuota = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await fetchQuota();
      setPlan(data.plan);
      setQuota({ practiceMinutesRemaining: data.practiceMinutesRemaining, periodEnd: data.periodEnd });
    } catch {
      // silently ignore — user may not be logged in yet
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { refreshQuota(); }, [refreshQuota]);

  return (
    <SubscriptionContext.Provider value={{ plan, quota, loaded, refreshQuota }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
