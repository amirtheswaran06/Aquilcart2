import React from 'react';
import { useAppStore } from '../../store/appStore';
import { ShoppingListTab } from './ShoppingListTab';
import { BudgetTab } from './BudgetTab';
import { OffersTab } from './OffersTab';
import { CartTab } from './CartTab';

export const CustomerView: React.FC = () => {
  const { state } = useAppStore();

  switch (state.customerTab) {
    case 'list':
      return <ShoppingListTab />;
    case 'budget':
      return <BudgetTab />;
    case 'offers':
      return <OffersTab />;
    case 'cart':
      return <CartTab />;
    default:
      return <ShoppingListTab />;
  }
};
