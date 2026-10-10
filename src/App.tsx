/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from './store/appStore';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { DeviceFrame } from './components/common/DeviceFrame';
import { MobileHeader } from './components/common/MobileHeader';
import { BottomTabNav } from './components/common/BottomTabNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { RoleSwitcherSheet } from './components/common/RoleSwitcherSheet';
import { CustomerView } from './components/customer/CustomerView';
import { ShopOwnerView } from './components/shop/ShopOwnerView';
import { WholesaleView } from './components/wholesale/WholesaleView';
import { OfferProviderView } from './components/provider/OfferProviderView';

export default function App() {
  const { state, setOnboarded } = useAppStore();
  const [showSplash, setShowSplash] = useState(false); // set to false initially for fast instant test, or user can click Replay Intro
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Splash Screen View
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  // Onboarding View
  if (!state.isOnboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setOnboarded(true);
        }}
      />
    );
  }

  // Main App within Device Frame
  return (
    <DeviceFrame
      onOpenRoleSwitcher={() => setShowRoleSwitcher(true)}
      onRestartIntro={() => {
        setOnboarded(false);
        setShowSplash(true);
      }}
    >
      {/* Native Sticky Mobile Top App Bar */}
      <MobileHeader
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenRoleSwitcher={() => setShowRoleSwitcher(true)}
      />

      {/* Role-Based Active View */}
      <div className="flex-1">
        {state.currentRole === 'customer' && <CustomerView />}
        {state.currentRole === 'shop_owner' && <ShopOwnerView />}
        {state.currentRole === 'wholesale' && <WholesaleView />}
        {state.currentRole === 'offer_provider' && <OfferProviderView />}
      </div>

      {/* Role-Based Native Fixed Bottom Tab Navigation */}
      <BottomTabNav />

      {/* Slide-Over Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Cross-Role Switcher Sheet */}
      <RoleSwitcherSheet
        isOpen={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
      />
    </DeviceFrame>
  );
}
