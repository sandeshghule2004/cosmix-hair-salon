import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import {
  Scissors, Wallet, Bell, PlusCircle, Share2, User, Phone,
  ChevronLeft, Check, LogOut, Copy, BarChart3, MapPin, Star,
} from 'lucide-react';

const COLORS = {
  bg: '#161209',
  card: '#211B10',
  cardAlt: '#2B2314',
  border: '#3D3319',
  gold: '#C9962E',
  goldLight: '#E8C05E',
  cream: '#F4EDDB',
  creamDim: '#AFA48A',
  coral: '#D96C4E',
  green: '#7FA582',
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const SERVICES = [
  { id: 'haircut', dbId: 1, name: 'Signature Haircut', price: 150, duration: '30 min' },
  { id: 'wash', dbId: 3, name: 'Wash & Style', price: 120, duration: '20 min' },
  { id: 'beardgroom', dbId: 5, name: 'Beard Grooming', price: 120, duration: '20 min' },
  { id: 'color', dbId: 4, name: 'Hair Colour', price: 400, duration: '60 min' },
];

const ADDONS = [
  { id: 'beard', name: 'Beard Trim', price: 99 },
  { id: 'massage', name: 'Head Massage', price: 199 },
  { id: 'towel', name: 'Hot Towel Shave', price: 149 },
  { id: 'spa', name: 'Hair Spa Treatment', price: 249 },
];

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  '10:00 PM'
];

const NAV_ITEMS = [
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'reminder', label: 'Reminder', icon: Bell },
  { id: 'addon', label: 'Add-on', icon: PlusCircle },
  { id: 'refer', label: 'Refer', icon: Share2 },
  { id: 'profile', label: 'Profile', icon: User },
];

function formatINR(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '\u20B9' + Math.abs(Math.round(n)).toLocaleString('en-IN');
}

function Toggle({ checked, onChange, label, last }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full py-3"
      style={{ borderBottom: last ? 'none' : `1px solid ${COLORS.border}`, background: 'transparent' }}
    >
      <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.cream }}>{label}</span>
      <span style={{ width: 42, height: 24, borderRadius: 999, background: checked ? COLORS.gold : COLORS.border, position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: COLORS.cream, transition: 'left .2s' }} />
      </span>
    </button>
  );
}

function AddOnPicker({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      {ADDONS.map((a) => {
        const on = selected.includes(a.id);
        return (
          <button
            key={a.id}
            onClick={() => onToggle(a.id)}
            className="w-full flex items-center justify-between p-3 rounded-xl"
            style={{ background: on ? COLORS.cardAlt : COLORS.card, border: `1px solid ${on ? COLORS.gold : COLORS.border}` }}
          >
            <div className="flex items-center gap-3">
              <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${on ? COLORS.gold : COLORS.creamDim}`, background: on ? COLORS.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {on && <Check size={13} color={COLORS.bg} strokeWidth={3} />}
              </span>
              <span style={{ fontFamily: FONT_BODY, color: COLORS.cream, fontSize: 13.5 }}>{a.name}</span>
            </div>
            <span style={{ fontFamily: FONT_BODY, color: COLORS.goldLight, fontSize: 13.5, fontWeight: 600 }}>+{formatINR(a.price)}</span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ onHome }) {
  return (
    <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg }}>
      <button onClick={onHome} className="flex items-center gap-2">
        <span style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(201,150,46,0.4)' }}>
          <Scissors size={15} color={COLORS.bg} />
        </span>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15, color: COLORS.cream, letterSpacing: 0.2 }}>Happy's Unisex Salon </span>
      </button>
      <div className="flex items-center gap-1">
        <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim }}>4.7 &middot; 10 reviews</span>
      </div>
    </div>
  );
}

function BackBar({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button onClick={onBack} style={{ width: 30, height: 30, borderRadius: 8, background: COLORS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
        <ChevronLeft size={17} color={COLORS.cream} />
      </button>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15, color: COLORS.cream }}>{title}</span>
    </div>
  );
}

function BottomNav({ active, onSelect }) {
  return (
    <div className="flex items-stretch px-2 py-1.5" style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.card }}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const on = active === item.id;
        return (
          <button key={item.id} onClick={() => onSelect(item.id)} className="flex-1 flex justify-center py-1">
            <span className="flex flex-col items-center gap-1" style={{ padding: '6px 10px', borderRadius: 14, background: on ? 'rgba(201,150,46,0.15)' : 'transparent', minWidth: 56 }}>
              <Icon size={18} color={on ? COLORS.gold : COLORS.creamDim} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: on ? COLORS.gold : COLORS.creamDim, fontWeight: on ? 600 : 400 }}>{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  useEffect(() => {
  async function testSupabase() {
    const { data, error } = await supabase
      .from('services')
      .select('*')

    console.log('Supabase data:', data)
    console.log('Supabase error:', error)
  }

  testSupabase()
}, [])
  const [loggedIn, setLoggedIn] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phone, setPhone] = useState('');
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [profileName, setProfileName] = useState('Guest');
  const [view, setView] = useState('home');

  const [balance, setBalance] = useState(550);
  const [lockedBonus, setLockedBonus] = useState(0);
  const [visits, setVisits] = useState(3);
  const [transactions, setTransactions] = useState([
    { id: 1, label: 'Wallet recharge \u2014 \u20B9500 + \u20B950 bonus', amount: 550, date: '12 Aug' },
    { id: 2, label: 'Wash & Style', amount: -120, date: '20 Aug' },
    { id: 3, label: 'Signature Haircut + Beard Trim', amount: -249, date: '2 Sep' },
  ]);

  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingAddons, setBookingAddons] = useState([]);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [bookingPayment, setBookingPayment] = useState('wallet');
  const [lastBookingTotal, setLastBookingTotal] = useState(0);

  const [remindersOn, setRemindersOn] = useState({ sms: true, whatsapp: true, push: false });

  const [referrals, setReferrals] = useState([
    { id: 1, name: 'Rohit S.', status: 'rewarded', date: '28 Aug' },
    { id: 2, name: 'Ananya P.', status: 'pending', date: '10 Sep' },
  ]);

  const [sessionBookingsCount, setSessionBookingsCount] = useState(0);
  const [sessionRevenue, setSessionRevenue] = useState(0);
  const [addonSales, setAddonSales] = useState({ beard: 34, massage: 21, towel: 15, spa: 9 });

  const referralCode = 'HAPPYSUNISEXSALON-' + (phone ? phone.replace(/\D/g, '').slice(-4) || '2481' : '2481');

  const today = new Date(2026, 8, 15);
  const lastVisitDate = new Date(2026, 7, 20);
  const avgDays = 25;
  const dueDate = new Date(lastVisitDate);
  dueDate.setDate(dueDate.getDate() + avgDays);
  const diffDays = Math.round((dueDate - today) / 86400000);
  const overdue = diffDays < 0;

  const rewardedCount = referrals.filter((r) => r.status === 'rewarded').length;
  const rewardedEarned = rewardedCount * 100;
  const isBooking = view.indexOf('book-') === 0;

  function handleLogin() {
    const name = customerNameInput.trim();
    const mobile = phoneInput.trim();

    if (!name) {
      alert('Please enter your name.');
      return;
    }

    if (!mobile) {
      alert('Please enter your mobile number.');
      return;
    }

    setProfileName(name);
    setPhone(mobile);
    setLoggedIn(true);
    setView('home');
  }

  async function handleAdminLogin() {
    const email = adminEmailInput.trim();
    const password = adminPasswordInput;

    if (!email || !password) {
      setAdminError('Enter the admin email and password.');
      return;
    }

    // Temporary app-level gate. We will replace this with Supabase Auth
    // when we do the database/security changes.
    const correctEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!correctEmail || !correctPassword) {
      setAdminError('Admin credentials are not configured yet.');
      return;
    }

    if (email !== correctEmail || password !== correctPassword) {
      setAdminError('Incorrect admin email or password.');
      return;
    }

    setAdminError('');
    setAdminLoggedIn(true);
    setAdminLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .select('id, customer_id, customer_name, customer_phone, service_id, booking_date, booking_time, total_amount, payment_method, status, created_at')
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });

    if (error) {
      console.error('Admin bookings error:', error);
      setAdminError('Could not load bookings. Check Supabase permissions.');
      setAdminBookings([]);
    } else {
      setAdminBookings(data || []);
    }

    setAdminLoading(false);
  }

  function adminLogout() {
    setAdminLoggedIn(false);
    setAdminMode(false);
    setAdminEmailInput('');
    setAdminPasswordInput('');
    setAdminError('');
    setAdminBookings([]);
  }

  function handleToggleAddon(id) {
    setBookingAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleRecharge(amount, bonusPct) {
    const bonus = Math.round(amount * bonusPct);
    setBalance((b) => b + amount);
    setLockedBonus((l) => l + bonus);
    setTransactions((t) => [{ id: Date.now(), label: `Wallet recharge \u2014 \u20B9${amount} + \u20B9${bonus} bonus`, amount: amount + bonus, date: 'Today' }, ...t]);
  }

  function serviceTotal() {
    const svc = SERVICES.find((s) => s.id === bookingService);
    const addonTotal = ADDONS.filter((a) => bookingAddons.includes(a.id)).reduce((s, a) => s + a.price, 0);
    return (svc ? svc.price : 0) + addonTotal;
  }

  function resetBooking() {
    setBookingService(null);
    setBookingDate('');
    setBookingAddons([]);
    setBookingSlot(null);
    setBookingPayment('wallet');
    setView('home');
  }

  async function confirmBooking() {
    const total = serviceTotal();
    const svc = SERVICES.find((s) => s.id === bookingService);

    if (!svc) {
      console.error('Service not found');
      return;
    }

    const customerName = profileName.trim();
    const customerPhone = phone.trim();

    if (!customerName || !customerPhone) {
      alert('Customer name and phone number are required.');
      return;
    }

    try {
      // Find the existing customer using their phone number.
      const { data: existingCustomer, error: findError } = await supabase
        .from('customers')
        .select('id, name, phone')
        .eq('phone', customerPhone)
        .maybeSingle();

      if (findError) {
        console.error('Customer lookup error:', findError);
        alert('Could not find customer. Please try again.');
        return;
      }

      let customer;

      // Create a customer record if this phone number is new.
      if (!existingCustomer) {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            name: customerName,
            phone: customerPhone,
          })
          .select('id, name, phone')
          .single();

        if (createError) {
          console.error('Customer creation error:', createError);
          alert('Could not create customer. Please try again.');
          return;
        }

        customer = newCustomer;
      } else {
        customer = existingCustomer;

        // Keep the customer's name up to date.
        if (customer.name !== customerName) {
          const { error: updateError } = await supabase
            .from('customers')
            .update({ name: customerName })
            .eq('id', customer.id);

          if (updateError) {
            console.error('Customer update error:', updateError);
          }
        }
      }

      console.log('Customer:', customer);

      // Save the booking and link it to the customer.
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: customer.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          service_id: svc.dbId,
          booking_date: bookingDate,
          booking_time: bookingSlot,
          status: 'confirmed',
          payment_method: bookingPayment,
          total_amount: total,
        })
        .select()
        .single();

      if (error) {
        console.error('Booking save error:', error);
        alert('Booking could not be saved. Check the console.');
        return;
      }

      console.log('Booking saved:', data);

      if (bookingPayment === 'wallet') {
        setBalance((b) => b - total);
      }

      if (lockedBonus > 0) {
        setBalance((b) => b + lockedBonus);
        setLockedBonus(0);
      }

      setVisits((v) => v + 1);

      setTransactions((t) => [
        {
          id: Date.now(),
          label: `${svc.name}${bookingAddons.length ? ' + add-ons' : ''}`,
          amount: -total,
          date: bookingDate,
        },
        ...t,
      ]);

      setLastBookingTotal(total);

      setAddonSales((prev) => {
        const next = { ...prev };
        bookingAddons.forEach((id) => {
          next[id] = (next[id] || 0) + 1;
        });
        return next;
      });

      setSessionBookingsCount((c) => c + 1);
      setSessionRevenue((r) => r + total);

      setView('book-confirm');
    } catch (err) {
      console.error('Unexpected booking error:', err);
      alert('Something went wrong while booking.');
    }
  }

  function markReferralRewarded(id) {
    setReferrals((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'rewarded' } : r)));
    setBalance((b) => b + 100);
    setTransactions((t) => [{ id: Date.now(), label: 'Referral reward credited', amount: 100, date: 'Today' }, ...t]);
  }

  function addSimulatedReferral() {
    const names = ['Priya K.', 'Devansh M.', 'Neha T.', 'Arjun V.', 'Sara Q.'];
    const name = names[Math.floor(Math.random() * names.length)];
    setReferrals((rs) => [{ id: Date.now(), name, status: 'pending', date: 'Today' }, ...rs]);
  }

  function renderHome() {
    const tiles = [
      { id: 'wallet', label: 'Wallet', sub: formatINR(balance) + ' balance', icon: Wallet },
      { id: 'reminder', label: 'Reminder', sub: overdue ? 'Visit overdue' : `Due in ${diffDays}d`, icon: Bell },
      { id: 'addon', label: 'Add-on', sub: 'Boost your bill', icon: PlusCircle },
      { id: 'refer', label: 'Refer & Earn', sub: rewardedCount + ' rewarded', icon: Share2 },
    ];
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(165deg, ${COLORS.cardAlt} 0%, ${COLORS.card} 65%)`, border: `1px solid ${COLORS.border}` }}>
          <Scissors size={150} strokeWidth={1} color={COLORS.gold} style={{ position: 'absolute', top: -36, right: -34, opacity: 0.07, transform: 'rotate(18deg)' }} />
          <div style={{ position: 'relative' }}>
            <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,150,46,0.14)', border: '1px solid rgba(201,150,46,0.3)' }}>
              <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.goldLight, fontWeight: 600 }}>4.7 rating &middot; 10 Google reviews</span>
            </div>
            <h1 className="tracking-tight" style={{ fontFamily: FONT_DISPLAY, fontSize: 25, fontWeight: 700, color: COLORS.cream, lineHeight: 1.15 }}>Happy's Unisex Salon</h1>
            <div className="flex items-start gap-2 mt-3">
              <MapPin size={14} color={COLORS.creamDim} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, lineHeight: 1.5 }}>
                Shop no.6&7,chavan tower, opposite SBI Bank, sahakar Nagar, Chh.sambhajinagar Chh, Chhartapati Sambhajinagar, Maharashtra 431001
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <a href="tel:7058402980" className="flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ border: `1px solid ${COLORS.border}`, fontFamily: FONT_BODY, fontSize: 12, color: COLORS.cream, textDecoration: 'none', background: COLORS.card }}>
                <Phone size={13} /> 7058402980
              </a>
              <a href="tel:8421143915" className="flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ border: `1px solid ${COLORS.border}`, fontFamily: FONT_BODY, fontSize: 12, color: COLORS.cream, textDecoration: 'none', background: COLORS.card }}>
                <Phone size={13} /> 8421143915
              </a>
            </div>
            <button onClick={() => setView('book-service')} className="w-full mt-2 py-2.5 rounded-xl" style={{ background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 12.5, boxShadow: '0 6px 18px rgba(201,150,46,0.35)' }}>
              Book Now
            </button>
          </div>
        </div>

        <div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginBottom: 10 }}>Your salon, five ways</p>
          <div className="grid grid-cols-2 gap-3">
            {tiles.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setView(item.id)} className="p-4 rounded-2xl text-left flex flex-col gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                  <span style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(201,150,46,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={COLORS.gold} />
                  </span>
                  <div>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: COLORS.cream }}>{item.label}</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 2 }}>{item.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={() => setView('profile')} className="p-4 rounded-2xl flex items-center justify-between" style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-3">
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={15} color={COLORS.bg} />
            </span>
            <div className="text-left">
              <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: COLORS.cream }}>{profileName}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim }}>{visits} visits &middot; profile &amp; owner view</p>
            </div>
          </div>
          <ChevronLeft size={16} color={COLORS.creamDim} style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>
    );
  }

  function renderWallet() {
    const recharges = [
      { amount: 300, bonusPct: 0.1 },
      { amount: 500, bonusPct: 0.1 },
      { amount: 1000, bonusPct: 0.15 },
    ];
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${COLORS.cardAlt} 0%, ${COLORS.card} 70%)`, border: `1px solid ${COLORS.gold}`, boxShadow: '0 10px 34px rgba(201,150,46,0.14)' }}>
          <Wallet size={130} strokeWidth={1} color={COLORS.gold} style={{ position: 'absolute', bottom: -30, right: -26, opacity: 0.08, transform: 'rotate(-12deg)' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>Wallet balance</p>
            <p className="tracking-tight" style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: COLORS.cream, marginTop: 4 }}>{formatINR(balance)}</p>
            {lockedBonus > 0 && (
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.coral})`, boxShadow: '0 4px 14px rgba(201,150,46,0.3)' }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: COLORS.bg }}>+{formatINR(lockedBonus)} bonus locked</span>
              </div>
            )}
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 8, lineHeight: 1.5 }}>Your bonus balance only unlocks on your next visit.</p>
          </div>
        </div>

        <div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginBottom: 10 }}>Recharge & earn bonus</p>
          <div className="grid grid-cols-3 gap-2">
            {recharges.map((r) => (
              <button key={r.amount} onClick={() => handleRecharge(r.amount, r.bonusPct)} className="p-3 rounded-xl flex flex-col items-center gap-1" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: COLORS.cream }}>&#8377;{r.amount}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.gold }}>+{Math.round(r.bonusPct * 100)}% bonus</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginBottom: 10 }}>Recent activity</p>
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.cream }}>{t.label}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>{t.date}</p>
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 700, color: t.amount > 0 ? COLORS.green : COLORS.creamDim, flexShrink: 0, marginLeft: 8 }}>
                  {t.amount > 0 ? '+' : '-'}{formatINR(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderReminder() {
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div className="p-5 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${overdue ? COLORS.coral : COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>{overdue ? 'Overdue for a visit' : 'Next visit due in'}</p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: overdue ? COLORS.coral : COLORS.cream, marginTop: 4 }}>
            {overdue ? `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}` : `${diffDays} days`}
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 6 }}>Last visit 20 Aug &middot; usual gap every {avgDays} days</p>
          <button onClick={() => setView('book-service')} className="mt-4 w-full py-2.5 rounded-xl" style={{ background: overdue ? `linear-gradient(150deg, #E88468, ${COLORS.coral})` : `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, boxShadow: overdue ? '0 6px 18px rgba(217,108,78,0.35)' : '0 6px 18px rgba(201,150,46,0.35)' }}>
            Book next visit
          </button>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, marginBottom: 10 }}>What reminders do</p>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.creamDim }}>6/yr</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>without reminders</p>
            </div>
            <div style={{ width: 24, height: 1, background: COLORS.border }} />
            <div className="text-center">
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.gold }}>9/yr</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>with reminders</p>
            </div>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.gold, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>+3 extra visits a year</p>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, marginBottom: 2 }}>Send reminders by</p>
          <Toggle checked={remindersOn.sms} onChange={(v) => setRemindersOn((r) => ({ ...r, sms: v }))} label="SMS" />
          <Toggle checked={remindersOn.whatsapp} onChange={(v) => setRemindersOn((r) => ({ ...r, whatsapp: v }))} label="WhatsApp" />
          <Toggle checked={remindersOn.push} onChange={(v) => setRemindersOn((r) => ({ ...r, push: v }))} label="Push notification" last />
        </div>
      </div>
    );
  }

  function renderAddonTab() {
    const total = ADDONS.filter((a) => bookingAddons.includes(a.id)).reduce((s, a) => s + a.price, 0);
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, color: COLORS.cream }}>Add to your booking</h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, marginTop: 4 }}>One tap on, one bigger bill. Pick what you would add to your next visit.</p>
        </div>
        <AddOnPicker selected={bookingAddons} onToggle={handleToggleAddon} />
        <div className="p-4 rounded-2xl flex items-center justify-between" style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim }}>Running total</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, color: COLORS.goldLight }}>{formatINR(total)}</span>
        </div>
        <button onClick={() => setView('book-service')} className="w-full py-3 rounded-xl" style={{ background: COLORS.gold, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5 }}>
          Start a booking with these
        </button>
      </div>
    );
  }

  function renderRefer() {
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div className="p-5 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, lineHeight: 1.5 }}>
            Customers bring customers. Share your code &mdash; you both get &#8377;100 wallet credit on their first visit.
          </p>
          <div className="flex items-center justify-between mt-4 p-3 rounded-xl" style={{ background: COLORS.cardAlt, border: `1px dashed ${COLORS.gold}` }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: COLORS.goldLight, letterSpacing: 1 }}>{referralCode}</span>
            <button
              onClick={() => { if (navigator.clipboard) navigator.clipboard.writeText(referralCode); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg"
              style={{ background: COLORS.gold, flexShrink: 0 }}
            >
              <Copy size={12} color={COLORS.bg} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: COLORS.bg }}>Copy</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 23, fontWeight: 700, color: COLORS.cream }}>{rewardedCount}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Successful referrals</p>
          </div>
          <div className="flex-1 p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 23, fontWeight: 700, color: COLORS.gold }}>{formatINR(rewardedEarned)}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Earned from referrals</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim }}>Your referrals</p>
            <button onClick={addSimulatedReferral} style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.gold, fontWeight: 600, background: 'transparent' }}>
              + Add friend
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.cream }}>{r.name}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>{r.date}</p>
                </div>
                {r.status === 'rewarded' ? (
                  <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: COLORS.green }}>+&#8377;100 credited</span>
                ) : (
                  <button onClick={() => markReferralRewarded(r.id)} className="px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${COLORS.gold}`, background: 'transparent', flexShrink: 0 }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>Mark visited</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderDashboard() {
    const todayBookings = 14 + sessionBookingsCount;
    const todayRevenue = 9350 + sessionRevenue;
    const walletLiability = 48600 + lockedBonus;
    const repeatRate = 68;
    const addonList = ADDONS.map((a) => ({ ...a, count: addonSales[a.id] || 0 })).sort((a, b) => b.count - a.count);
    const maxCount = Math.max(...addonList.map((a) => a.count), 1);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} color={COLORS.gold} />
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, fontWeight: 700, color: COLORS.cream }}>Today, across the shop</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.cream }}>{todayBookings}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Bookings today</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.cream }}>{formatINR(todayRevenue)}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Revenue today</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.coral }}>{formatINR(walletLiability)}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Wallet liability</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.green }}>{repeatRate}%</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Repeat-visit rate</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim, marginBottom: 12 }}>Top add-ons sold</p>
          <div className="flex flex-col gap-3">
            {addonList.map((a) => (
              <div key={a.id}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.cream }}>{a.name}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim }}>{a.count}</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 999, background: COLORS.border }}>
                  <div style={{ width: `${(a.count / maxCount) * 100}%`, height: 6, borderRadius: 999, background: COLORS.gold }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="px-4 py-5 flex flex-col gap-5">
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <span style={{ width: 46, height: 46, borderRadius: '50%', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={21} color={COLORS.bg} />
          </span>
          <div className="flex-1">
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full"
              style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: COLORS.cream, outline: 'none', border: 'none', background: 'transparent' }}
            />
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 2 }}>{phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: COLORS.cream }}>{visits}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>Visits</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: COLORS.cream }}>{formatINR(balance)}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>Wallet</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: COLORS.cream }}>{rewardedCount}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 2 }}>Referrals</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>
            Your appointments and profile are linked to your name and mobile number.
          </p>
        </div>

        <button
          onClick={() => { setLoggedIn(false); setView('home'); setPhoneInput(''); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl"
          style={{ border: `1px solid ${COLORS.border}`, background: 'transparent' }}
        >
          <LogOut size={14} color={COLORS.creamDim} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim }}>Log out</span>
        </button>
      </div>
    );
  }

  function renderBooking() {
    if (view === 'book-confirm') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center px-6" style={{ minHeight: '70vh' }}>
          <span style={{ width: 92, height: 92, borderRadius: '50%', border: `1px dashed rgba(201,150,46,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 26px rgba(201,150,46,0.4)' }}>
              <Check size={26} color={COLORS.bg} strokeWidth={3} />
            </span>
          </span>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: COLORS.cream, textAlign: 'center' }}>Booking confirmed</h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginTop: 6, textAlign: 'center' }}>
            {SERVICES.find((s) => s.id === bookingService)
              ? SERVICES.find((s) => s.id === bookingService).name
              : ''}{' '}
            &middot; {bookingDate} &middot; {bookingSlot}
          </p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: COLORS.goldLight, marginTop: 16 }}>{formatINR(lastBookingTotal)}</p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 4 }}>Paid from {bookingPayment === 'wallet' ? 'wallet' : 'pay at salon'}</p>
          <button onClick={resetBooking} className="w-full py-3 rounded-xl mt-10" style={{ background: COLORS.gold, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5 }}>
            Back to home
          </button>
        </div>
      );
    }

    const steps = ['book-service', 'book-addons', 'book-datetime', 'book-payment'];
    const stepIndex = steps.indexOf(view);
    const titles = { 'book-service': 'Choose a service', 'book-addons': 'Add to your booking', 'book-datetime': 'Pick a time', 'book-payment': 'Payment' };

    function goBack() {
      if (stepIndex <= 0) { setView('home'); return; }
      setView(steps[stepIndex - 1]);
    }
    function goNext() {
      if (stepIndex < steps.length - 1) setView(steps[stepIndex + 1]);
    }

    const nextDisabled =
      (view === 'book-service' && !bookingService) ||
      (view === 'book-datetime' && (!bookingDate || !bookingSlot));

    return (
      <>
        <BackBar title={titles[view]} onBack={goBack} />
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= stepIndex ? COLORS.gold : COLORS.border }} />
            ))}
          </div>

          {view === 'book-service' && (
            <div className="flex flex-col gap-2">
              {SERVICES.map((s) => {
                const on = bookingService === s.id;
                return (
                  <button key={s.id} onClick={() => setBookingService(s.id)} className="w-full flex items-center justify-between p-4 rounded-xl" style={{ background: on ? COLORS.cardAlt : COLORS.card, border: `1px solid ${on ? COLORS.gold : COLORS.border}` }}>
                    <div className="text-left">
                      <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: COLORS.cream }}>{s.name}</p>
                      <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim, marginTop: 2 }}>{s.duration}</p>
                    </div>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 700, color: COLORS.goldLight }}>{formatINR(s.price)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {view === 'book-addons' && (
            <>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>Optional &mdash; add extras to this visit</p>
              <AddOnPicker selected={bookingAddons} onToggle={handleToggleAddon} />
            </>
          )}

          {view === 'book-datetime' && (
            <>
              <div>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    color: COLORS.creamDim,
                    marginBottom: 8,
                  }}
                >
                  Select date
                </p>

                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setBookingSlot(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: COLORS.card,
                    border: `1px solid ${
                      bookingDate ? COLORS.gold : COLORS.border
                    }`,
                    color: COLORS.cream,
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    outline: 'none',
                    colorScheme: 'dark',
                  }}
                />
              </div>

              {bookingDate && (
                <div>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      color: COLORS.creamDim,
                      marginBottom: 10,
                    }}
                  >
                    Available times
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const on = bookingSlot === t;

                      return (
                        <button
                          key={t}
                          onClick={() => setBookingSlot(t)}
                          className="py-3 rounded-xl"
                          style={{
                            background: on ? COLORS.gold : COLORS.card,
                            border: `1px solid ${
                              on ? COLORS.gold : COLORS.border
                            }`,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: FONT_BODY,
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: on ? COLORS.bg : COLORS.cream,
                            }}
                          >
                            {t}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {view === 'book-payment' && (
            <div className="flex flex-col gap-3">
              <button onClick={() => setBookingPayment('wallet')} className="w-full flex items-center justify-between p-4 rounded-xl" style={{ background: bookingPayment === 'wallet' ? COLORS.cardAlt : COLORS.card, border: `1px solid ${bookingPayment === 'wallet' ? COLORS.gold : COLORS.border}` }}>
                <div className="flex items-center gap-3">
                  <Wallet size={18} color={COLORS.gold} />
                  <div className="text-left">
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: COLORS.cream }}>Pay from wallet</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Balance {formatINR(balance)}</p>
                  </div>
                </div>
                {bookingPayment === 'wallet' && <Check size={16} color={COLORS.gold} />}
              </button>
              <button onClick={() => setBookingPayment('salon')} className="w-full flex items-center justify-between p-4 rounded-xl" style={{ background: bookingPayment === 'salon' ? COLORS.cardAlt : COLORS.card, border: `1px solid ${bookingPayment === 'salon' ? COLORS.gold : COLORS.border}` }}>
                <div className="flex items-center gap-3">
                  <Phone size={18} color={COLORS.creamDim} />
                  <div className="text-left">
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: COLORS.cream }}>Pay at salon</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Cash or UPI on arrival</p>
                  </div>
                </div>
                {bookingPayment === 'salon' && <Check size={16} color={COLORS.gold} />}
              </button>
              {bookingPayment === 'wallet' && balance < serviceTotal() && (
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.coral }}>
                  Wallet balance is short by {formatINR(serviceTotal() - balance)}. Recharge first, or pay at salon.
                </p>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim }}>Total</p>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, color: COLORS.cream }}>{formatINR(serviceTotal())}</p>
            </div>
            {view === 'book-payment' ? (
              <button onClick={confirmBooking} className="px-6 py-3 rounded-xl" style={{ background: COLORS.gold, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5 }}>
                Confirm & pay
              </button>
            ) : (
              <button onClick={goNext} disabled={nextDisabled} className="px-6 py-3 rounded-xl" style={{ background: COLORS.gold, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5, opacity: nextDisabled ? 0.5 : 1 }}>
                Continue
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  function renderLogin() {
    if (adminMode) {
      if (adminLoggedIn) {
        const totalRevenue = adminBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

        return (
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.gold }}>OWNER / ADMIN</p>
                <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: COLORS.cream }}>Happy's Unisex Salon</h1>
              </div>
              <button
                onClick={adminLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ border: `1px solid ${COLORS.border}`, background: COLORS.card }}
              >
                <LogOut size={14} color={COLORS.creamDim} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.creamDim }}>Logout</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: COLORS.cream }}>{adminBookings.length}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Total bookings</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: COLORS.goldLight }}>{formatINR(totalRevenue)}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 2 }}>Booking revenue</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: COLORS.cream }}>Customer appointments</p>
                  <button
                    onClick={handleAdminLogin}
                    className="px-3 py-1.5 rounded-lg"
                    style={{ border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.creamDim, fontFamily: FONT_BODY, fontSize: 10.5 }}
                  >
                    Refresh
                  </button>
                </div>

                {adminLoading ? (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>Loading bookings...</p>
                ) : adminBookings.length === 0 ? (
                  <div className="p-4 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: COLORS.creamDim }}>No bookings found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {adminBookings.map((booking) => (
                      <div key={booking.id} className="p-4 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, color: COLORS.cream }}>
                              {booking.customer_name || 'Unnamed customer'}
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim, marginTop: 3 }}>
                              {booking.customer_phone || 'No phone'}
                            </p>
                            <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.cream, marginTop: 8 }}>
                              {booking.booking_date} · {booking.booking_time}
                            </p>
                          </div>
                          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: COLORS.goldLight, flexShrink: 0 }}>
                            {formatINR(booking.total_amount)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.creamDim }}>
                            {booking.payment_method === 'wallet' ? 'Wallet' : 'Pay at salon'}
                          </span>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: COLORS.green, fontWeight: 600 }}>
                            {booking.status || 'confirmed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col justify-center px-6" style={{ minHeight: '100vh' }}>
          <div className="flex flex-col items-center mb-8">
            <span style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 10px 30px rgba(201,150,46,0.4)' }}>
              <BarChart3 size={30} color={COLORS.bg} />
            </span>
            <h1 className="tracking-tight" style={{ fontFamily: FONT_DISPLAY, fontSize: 25, fontWeight: 700, color: COLORS.cream, textAlign: 'center' }}>Owner Login</h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginTop: 6, textAlign: 'center' }}>
              Private salon management panel
            </p>
          </div>

          <label style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim, marginBottom: 6 }}>Admin email</label>
          <input
            type="email"
            value={adminEmailInput}
            onChange={(e) => { setAdminEmailInput(e.target.value); setAdminError(''); }}
            placeholder="owner@example.com"
            className="w-full px-4 py-3 rounded-xl mb-4"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.cream, fontFamily: FONT_BODY, fontSize: 14.5, outline: 'none' }}
          />

          <label style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={adminPasswordInput}
            onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminError(''); }}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl mb-3"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.cream, fontFamily: FONT_BODY, fontSize: 14.5, outline: 'none' }}
          />

          {adminError && (
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: COLORS.coral, marginBottom: 10 }}>
              {adminError}
            </p>
          )}

          <button onClick={handleAdminLogin} className="w-full py-3 rounded-xl" style={{ background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14.5 }}>
            Login as Owner
          </button>

          <button
            onClick={() => { setAdminMode(false); setAdminError(''); }}
            className="w-full py-3 rounded-xl mt-3"
            style={{ border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.creamDim, fontFamily: FONT_BODY, fontSize: 12.5 }}
          >
            Back to Customer Login
          </button>

          <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: COLORS.creamDim, marginTop: 12, textAlign: 'center' }}>
            Owner access will be secured through Supabase Auth in the database setup.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center px-6" style={{ minHeight: '100vh' }}>
        <div className="flex flex-col items-center mb-8">
          <span style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 10px 30px rgba(201,150,46,0.4)' }}>
            <Scissors size={30} color={COLORS.bg} />
          </span>
          <h1 className="tracking-tight" style={{ fontFamily: FONT_DISPLAY, fontSize: 25, fontWeight: 700, color: COLORS.cream, textAlign: 'center' }}>Happy's Unisex Salon</h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: COLORS.creamDim, marginTop: 6, textAlign: 'center', lineHeight: 1.5, maxWidth: 260 }}>
            Book your salon appointment quickly and easily.
          </p>
        </div>

        <label style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim, marginBottom: 6 }}>Your name</label>
        <input
          value={customerNameInput}
          onChange={(e) => setCustomerNameInput(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-xl mb-4"
          style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.cream, fontFamily: FONT_BODY, fontSize: 14.5, outline: 'none' }}
        />

        <label style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.creamDim, marginBottom: 6 }}>Phone number</label>
        <input
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="98765 43210"
          inputMode="tel"
          className="w-full px-4 py-3 rounded-xl mb-4"
          style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.cream, fontFamily: FONT_BODY, fontSize: 14.5, outline: 'none' }}
        />

        <button onClick={handleLogin} className="w-full py-3 rounded-xl" style={{ background: `linear-gradient(150deg, ${COLORS.goldLight}, ${COLORS.gold})`, color: COLORS.bg, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14.5, boxShadow: '0 8px 24px rgba(201,150,46,0.35)' }}>
          Continue
        </button>

        <button
          onClick={() => { setAdminMode(true); setAdminError(''); }}
          className="w-full py-3 rounded-xl mt-3"
          style={{ border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.creamDim, fontFamily: FONT_BODY, fontSize: 12.5 }}
        >
          Owner / Admin Login
        </button>
      </div>
    );
  }

  function renderContent() {
    if (!loggedIn || adminMode) return renderLogin();
    if (isBooking) return renderBooking();
    return (
      <>
        <TopBar onHome={() => setView('home')} />
        <div className="flex-1 overflow-y-auto">
          {view === 'home' && renderHome()}
          {view === 'wallet' && renderWallet()}
          {view === 'reminder' && renderReminder()}
          {view === 'addon' && renderAddonTab()}
          {view === 'refer' && renderRefer()}
          {view === 'profile' && renderProfile()}
        </div>
        {view !== 'home' && <BottomNav active={view} onSelect={setView} />}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', background: `radial-gradient(circle at 50% -10%, #2C2213 0%, ${COLORS.bg} 55%)`, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: ${COLORS.creamDim}; }
        input:focus { border-color: ${COLORS.gold} !important; box-shadow: 0 0 0 3px rgba(201,150,46,0.15); }
        button { cursor: pointer; transition: transform .12s ease, opacity .12s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease; }
        button:active { transform: scale(0.96); }
        button:disabled:active { transform: none; }
        ::-webkit-scrollbar { width: 0px; height: 0px; }
      `}</style>
      <div className="w-full flex flex-col" style={{ maxWidth: '100%', minHeight: '100vh', background: 'transparent', boxShadow: '0 0 60px rgba(0,0,0,0.45)' }}>
        {renderContent()}
      </div>
    </div>
  );
}
