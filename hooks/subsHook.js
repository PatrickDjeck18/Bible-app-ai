// src/contexts/SubscriptionContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';

const SubscriptionContext = createContext({
  isSubscribed: false,
  refreshSubscription: async () => {},
});

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const refreshSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasActiveEntitlement =
        customerInfo.entitlements.active.bible_add_free_monthly ||
        customerInfo.entitlements.active.bible_add_free_weekly;
      setIsSubscribed(!!hasActiveEntitlement);
    } catch (e) {
      console.log('❌ Error fetching subscription info:', e);
    }
  };

  useEffect(() => {
    refreshSubscription();
    const listener = Purchases.addCustomerInfoUpdateListener(() => {
      refreshSubscription(); // auto-refresh on subscription change
    });
    return () => listener.remove();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
