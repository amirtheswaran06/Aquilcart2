import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { ShoppingItem, UnitType } from '../../types';
import {
  Plus,
  Check,
  Tag,
  ShoppingBag,
  Sparkles,
  Search,
  Store,
  ChevronRight,
  TrendingDown,
  Trash2,
  X,
  Repeat,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/sound';

export const ShoppingListTab: React.FC = () => {
  const {
    state,
    addShoppingItem,
    toggleItemComplete,
    removeShoppingItem,
    addItemToCart,
    setCustomerTab
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [comparingItem, setComparingItem] = useState<ShoppingItem | null>(null);

  // New Item Form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ShoppingItem['category']>('Produce');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState<UnitType>('kg');
  const [newItemPrice, setNewItemPrice] = useState('80');

  // Budget calculations
  const totalEstimated = state.shoppingList.reduce((acc, item) => acc + item.estimatedPrice, 0);
  const budgetLimit = state.budget.tripLimit;
  const remainingBudget = Math.max(0, budgetLimit - totalEstimated);
  const budgetPercentage = Math.min(100, Math.round((totalEstimated / budgetLimit) * 100));

  // Matched offers calculation
  const totalSavings = state.shoppingList.reduce((acc, item) => {
    if (item.matchedOfferDiscount) {
      return acc + Math.round((item.estimatedPrice * item.matchedOfferDiscount) / 100);
    }
    return acc;
  }, 0);

  const pendingItems = state.shoppingList.filter((item) => !item.isCompleted);
  const completedItems = state.shoppingList.filter((item) => item.isCompleted);

  const filteredItems = state.shoppingList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickStaples = [
    { name: 'Cow Milk 1L', category: 'Dairy' as const, qty: 1, unit: 'L' as UnitType, price: 62 },
    { name: 'Red Onions 1kg', category: 'Produce' as const, qty: 1, unit: 'kg' as UnitType, price: 35 },
    { name: 'Basmati Rice', category: 'Pantry' as const, qty: 2, unit: 'kg' as UnitType, price: 180 },
    { name: 'Farm Eggs 6pk', category: 'Dairy' as const, qty: 6, unit: 'pcs' as UnitType, price: 55 },
    { name: 'Whole Wheat Bread', category: 'Bakery' as const, qty: 1, unit: 'pack' as UnitType, price: 45 },
  ];

  const handleQuickAdd = (staple: typeof quickStaples[0]) => {
    sound.playSuccess();
    addShoppingItem({
      name: staple.name,
      category: staple.category,
      quantity: staple.qty,
      unit: staple.unit,
      estimatedPrice: staple.price,
      isCompleted: false,
      shopPrices: [
        { shopId: 'shop-1', shopName: 'GreenMart Organics', price: staple.price - 4, inStock: true, distanceKm: 0.8 },
        { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: staple.price, inStock: true, distanceKm: 1.4 },
      ],
    });
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    sound.playSuccess();
    const estPrice = parseFloat(newItemPrice) || 50;

    addShoppingItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: parseFloat(newItemQty) || 1,
      unit: newItemUnit,
      estimatedPrice: estPrice,
      isCompleted: false,
      shopPrices: [
        { shopId: 'shop-1', shopName: 'GreenMart Organics', price: estPrice, inStock: true, distanceKm: 0.8 },
        { shopId: 'shop-2', shopName: 'Daily SuperBazaar', price: Math.round(estPrice * 1.05), inStock: true, distanceKm: 1.4 },
      ],
    });

    setNewItemName('');
    setNewItemQty('1');
    setNewItemPrice('80');
    setShowAddModal(false);
  };

  const handleAddToCart = (item: ShoppingItem) => {
    sound.playSuccess();
    const bestShop = item.shopPrices?.[0] || { shopId: 'shop-1', shopName: 'GreenMart Organics', price: item.estimatedPrice };
    const discount = item.matchedOfferDiscount ? Math.round((bestShop.price * item.matchedOfferDiscount) / 100) : 0;

    addItemToCart({
      name: item.name,
      category: item.category,
      price: bestShop.price - discount,
      unit: item.unit,
      shopId: bestShop.shopId,
      shopName: bestShop.shopName,
      savingsApplied: discount,
    });
  };

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto">
      {/* Personalized Greeting & Demo Label */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Good Morning, {state.user.name.split(' ')[0]}
          </span>
          <h2 className="font-display font-extrabold text-xl text-white">Smart Grocery List</h2>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8FF55] bg-[#123E32] border border-[#16834A]/40 px-2 py-0.5 rounded-full inline-block">
            DEMO DATA · PIN {state.deliveryPinCode}
          </span>
        </div>
      </div>

      {/* Shopping Budget Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D3328] via-[#123E32] to-[#081E17] border border-[#16834A]/50 p-4 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C8FF55]/20 border border-[#C8FF55]/40 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#C8FF55]" />
            </div>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-200">
              Trip Budget Radar
            </span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setCustomerTab('budget');
            }}
            className="text-[11px] font-semibold text-[#C8FF55] hover:underline flex items-center gap-0.5"
          >
            <span>Edit Limits</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center border-y border-[#16834A]/30 mb-3">
          <div>
            <span className="text-[10px] text-emerald-300/80 uppercase block">Budget</span>
            <span className="font-display font-black text-base text-white tabular-nums">
              ₹{budgetLimit.toLocaleString()}
            </span>
          </div>
          <div className="border-x border-[#16834A]/30">
            <span className="text-[10px] text-emerald-300/80 uppercase block">Estimated</span>
            <span className="font-display font-black text-base text-[#C8FF55] tabular-nums">
              ₹{totalEstimated.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300/80 uppercase block">Remaining</span>
            <span
              className={`font-display font-black text-base tabular-nums ${
                remainingBudget > 0 ? 'text-emerald-300' : 'text-[#FF8A3D]'
              }`}
            >
              ₹{remainingBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-[10px] font-semibold text-emerald-200">
            <span>Budget Utilized</span>
            <span className="tabular-nums">{budgetPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-[#081E17] rounded-full overflow-hidden p-0.5 border border-[#16834A]/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, budgetPercentage)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                budgetPercentage > 95
                  ? 'bg-gradient-to-r from-[#FF8A3D] to-red-500'
                  : 'bg-gradient-to-r from-[#16834A] to-[#C8FF55]'
              }`}
            />
          </div>
        </div>

        {/* Potential savings strip */}
        <div className="flex items-center justify-between bg-[#081E17]/80 rounded-xl px-3 py-1.5 border border-[#16834A]/40 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#C8FF55]" />
            <span>Eligible Offer Savings:</span>
          </div>
          <span className="font-display font-bold text-[#C8FF55] tabular-nums">
            -₹{totalSavings}
          </span>
        </div>
      </div>

      {/* Quick Search & Add Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or filter list..."
            className="w-full bg-[#081E17] border border-[#16834A]/40 focus:border-[#C8FF55] text-white placeholder-emerald-400/50 text-xs rounded-2xl pl-9 pr-3 py-2.5 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setShowAddModal(true);
          }}
          className="h-10 px-3.5 bg-[#C8FF55] text-[#0D3328] rounded-2xl font-display font-extrabold text-xs flex items-center gap-1 shadow-md hover:bg-[#d5ff7a] transition-all touch-press shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>
      </div>

      {/* Quick Staples Carousel */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
            Quick Add Staples
          </span>
          <span className="text-[10px] text-emerald-400/60">Tap to add</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {quickStaples.map((staple, i) => (
            <button
              key={i}
              onClick={() => handleQuickAdd(staple)}
              className="bg-[#0D3328] hover:bg-[#123E32] border border-[#16834A]/40 hover:border-[#C8FF55] px-3 py-1.5 rounded-xl text-left shrink-0 text-white transition-all touch-press flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-[#C8FF55]" />
              <div className="flex flex-col">
                <span className="text-[11px] font-medium leading-tight">{staple.name}</span>
                <span className="text-[10px] text-emerald-300/70 font-mono">₹{staple.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shopping List Items Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <span>To Buy ({pendingItems.length})</span>
          </span>
          <span className="text-[11px] text-emerald-300/70">
            Tap circle to check off
          </span>
        </div>

        {pendingItems.length === 0 && (
          <div className="bg-[#081E17]/60 border border-[#16834A]/30 rounded-2xl p-6 text-center">
            <p className="text-xs text-emerald-200/80">All items are checked off or list is empty!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-xs font-bold text-[#C8FF55] hover:underline"
            >
              + Add groceries to start planning
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          <AnimatePresence>
            {(searchQuery ? filteredItems.filter((i) => !i.isCompleted) : pendingItems).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0D3328] border border-[#16834A]/40 rounded-2xl p-3 shadow-md hover:border-[#16834A] transition-all text-white"
              >
                <div className="flex items-start gap-2.5">
                  {/* Completion Toggle Button */}
                  <button
                    onClick={() => toggleItemComplete(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-emerald-400/60 hover:border-[#C8FF55] flex items-center justify-center shrink-0 mt-0.5 touch-press"
                    aria-label="Mark completed"
                  >
                    {item.isCompleted && <Check className="w-3.5 h-3.5 text-[#C8FF55]" />}
                  </button>

                  {/* Main Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-display font-bold text-sm text-white truncate">
                        {item.name}
                      </h4>
                      <span className="font-display font-extrabold text-sm text-[#C8FF55] tabular-nums shrink-0">
                        ₹{item.estimatedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-emerald-200/70 mt-0.5">
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <span>·</span>
                      <span>{item.category}</span>
                      {item.notes && (
                        <>
                          <span>·</span>
                          <span className="truncate italic text-emerald-300/80">{item.notes}</span>
                        </>
                      )}
                    </div>

                    {/* Matched Offer Badge */}
                    {item.matchedOfferDiscount && (
                      <div className="mt-2 flex items-center gap-1.5 bg-[#123E32] border border-[#C8FF55]/40 rounded-lg px-2 py-0.5 text-[11px] text-[#C8FF55]">
                        <Tag className="w-3 h-3 text-[#C8FF55]" />
                        <span className="font-bold">
                          {item.matchedOfferDiscount}% OFF Flash Deal Matched
                        </span>
                        <span className="text-emerald-300/70 font-mono text-[10px]">
                          (Save ₹{Math.round((item.estimatedPrice * item.matchedOfferDiscount) / 100)})
                        </span>
                      </div>
                    )}

                    {/* Action buttons: Price compare & Add to Cart */}
                    <div className="mt-2.5 pt-2 border-t border-[#16834A]/20 flex items-center justify-between">
                      <button
                        onClick={() => {
                          sound.playPop();
                          setComparingItem(item);
                        }}
                        className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 hover:underline touch-press"
                      >
                        <Store className="w-3 h-3 text-[#FF8A3D]" />
                        <span>Compare Shops</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeShoppingItem(item.id)}
                          className="p-1 text-emerald-300/60 hover:text-red-400 touch-press"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-[#C8FF55] text-[#0D3328] font-bold text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 hover:bg-[#d3ff75] transition-all touch-press shadow-sm"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completed items accordion */}
        {completedItems.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/70 block mb-2">
              Purchased / Done ({completedItems.length})
            </span>
            <div className="space-y-2 opacity-70">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#081E17] border border-[#16834A]/30 rounded-xl p-2.5 flex items-center justify-between text-white"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleItemComplete(item.id)}
                      className="w-5 h-5 rounded-full bg-[#16834A] flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </button>
                    <span className="text-xs line-through text-emerald-200/60">{item.name}</span>
                  </div>
                  <span className="text-xs text-emerald-400/50 font-mono tabular-nums">
                    ₹{item.estimatedPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Item Bottom Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-md bg-[#0D3328] border-t border-[#16834A] rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="w-12 h-1 bg-[#16834A]/60 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-extrabold text-lg text-white">Add Grocery Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-[#123E32] flex items-center justify-center text-emerald-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Organic Tomatoes, Sourdough Bread"
                    className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] text-white text-sm rounded-xl px-3 py-2 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                      Unit
                    </label>
                    <select
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value as UnitType)}
                      className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] text-white text-sm rounded-xl px-3 py-2 focus:outline-none"
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="g">g (Grams)</option>
                      <option value="L">L (Litres)</option>
                      <option value="ml">ml (Millilitres)</option>
                      <option value="pack">pack</option>
                      <option value="pcs">pcs (Pieces)</option>
                      <option value="bunch">bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                      Estimated Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] text-white text-sm rounded-xl px-3 py-2 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-300 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as ShoppingItem['category'])}
                      className="w-full bg-[#081E17] border border-[#16834A] focus:border-[#C8FF55] text-white text-sm rounded-xl px-3 py-2 focus:outline-none"
                    >
                      <option value="Produce">Produce</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Pantry">Pantry</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Household">Household</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C8FF55] text-[#0D3328] font-display font-extrabold text-sm rounded-2xl shadow-xl hover:bg-[#d5ff7a] transition-all touch-press mt-2"
                >
                  Add to Shopping List
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Price Comparison Sheet */}
      <AnimatePresence>
        {comparingItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setComparingItem(null)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-md bg-[#0D3328] border-t border-[#16834A] rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="w-12 h-1 bg-[#16834A]/60 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] text-[#C8FF55] font-bold uppercase tracking-wider">
                    Store Price Radar
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    {comparingItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setComparingItem(null)}
                  className="w-7 h-7 rounded-full bg-[#123E32] flex items-center justify-center text-emerald-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 mb-4">
                {comparingItem.shopPrices.map((shop, i) => (
                  <div
                    key={shop.shopId}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      i === 0
                        ? 'bg-[#123E32] border-[#C8FF55]'
                        : 'bg-[#081E17] border-[#16834A]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-sm text-white">{shop.shopName}</span>
                        {i === 0 && (
                          <span className="text-[9px] bg-[#C8FF55] text-[#0D3328] font-bold px-1.5 py-0.2 rounded">
                            Best Deal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-200/70 mt-0.5">
                        <span>{shop.distanceKm} km away</span>
                        <span>·</span>
                        <span className={shop.inStock ? 'text-emerald-400' : 'text-red-400'}>
                          {shop.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-base text-white tabular-nums">
                        ₹{shop.price}
                      </span>
                      <button
                        disabled={!shop.inStock}
                        onClick={() => {
                          sound.playSuccess();
                          addItemToCart({
                            name: comparingItem.name,
                            category: comparingItem.category,
                            price: shop.price,
                            unit: comparingItem.unit,
                            shopId: shop.shopId,
                            shopName: shop.shopName,
                          });
                          setComparingItem(null);
                        }}
                        className={`block text-[11px] font-bold px-2.5 py-1 rounded-lg mt-1 ${
                          shop.inStock
                            ? 'bg-[#C8FF55] text-[#0D3328] hover:bg-[#d5ff7a]'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Choose Store
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternative Recommendations */}
              {comparingItem.alternatives && comparingItem.alternatives.length > 0 && (
                <div className="bg-[#081E17] border border-[#16834A]/30 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2">
                    <TrendingDown className="w-3.5 h-3.5 text-[#C8FF55]" />
                    <span>Cheaper Alternatives Available</span>
                  </div>
                  <div className="space-y-2">
                    {comparingItem.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-white">{alt.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-mono">₹{alt.estimatedPrice}</span>
                          <span className="text-[10px] bg-emerald-950 text-[#C8FF55] px-1.5 py-0.5 rounded font-bold">
                            Save ₹{alt.savings}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
