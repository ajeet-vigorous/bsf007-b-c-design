import React from 'react';
import { RiCloseFill } from 'react-icons/ri'
import { useState } from 'react';

export default function BonusRules(props) {
    const [showRules, setShowRules] = useState(1);
    // const [activeItem, setActiveItem] = useState(1);

    const toggleSection = (id) => {
        setShowRules(prev => (prev === id ? null : id));
    };

    // const viewRulesSection = (data) => {
    //     setShowRules(data)
    //     setActiveItem(data);
    // }

    const { setBonusFalse } = props;

    return (
        <>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full h-full flex items-start justify-center py-6 overflow-y-auto rounded-t-lg">
                    <div className="xl:w-[45%] lg:w-[80%] mx-2 w-full text-black rounded-t-lg shadow-md">
                        <div className="rounded-t-lg bg-white">
                            <div className=" w-full h-full bg-[var(--darkcolor)] flex justify-between rounded-t-lg px-2 py-2 items-center">
                                <h2 className="text-white font-[400] text-[22px] tracking-wide">
                                    Bonus Rules
                                </h2>
                                <span onClick={() => setBonusFalse()}>
                                    <RiCloseFill size={20} className='text-white cursor-pointer' />
                                </span>
                            </div>
                            <div className="px-[10px] py-[9px] text-sm text-[#222] space-y-2 leading-relaxed">
                                <p><strong>All new members!</strong> We welcome you with a <strong>300% Sports Bonus</strong> on your starting journey.</p>

                                <p><strong>=&gt;</strong> Claim your bonus immediately and start your journey two times faster.</p>

                                <p><strong>=&gt;</strong> The welcome bonus applies exclusively to each user's <strong>First</strong>, <strong>Second</strong>, and even on <strong>Every Deposit</strong>.</p>

                                <p><strong>=&gt;</strong> Minimum deposit amount is <strong>300 INR</strong> for every deposit to claim the bonus.</p>

                                <p><strong>=&gt;</strong> Register an account and make your first deposit.</p>

                                <p><strong>First Deposit:</strong><br />
                                    INR 300–5,000 &rarr; <strong>300%</strong> on <strong>200X True Rolling</strong><br />
                                    INR 5,001–2,00,000 &rarr; <strong>50% or 15,000</strong> (whichever is MORE) on <strong>200X True Rolling</strong><br />
                                    INR 2,00,001 OR MORE &rarr; <strong>1,00,000</strong> on <strong>200X True Rolling</strong>
                                </p>

                                <p><strong>Second Deposit:</strong><br />
                                    INR 300–10,000 &rarr; <strong>50%</strong> on <strong>200X True Rolling</strong><br />
                                    INR 10,001–4,00,000 &rarr; <strong>25% or 5,000</strong> (whichever is MORE) on <strong>200X True Rolling</strong><br />
                                    INR 4,00,001 OR MORE &rarr; <strong>1,00,000</strong> on <strong>200X True Rolling</strong>
                                </p>

                                <p><strong>On Every Deposit Bonus (Min: ₹1000):</strong> 10% on 200X True Rolling up to a deposit of ₹10,00,000<br />
                                    (If deposit is more than ₹10,00,000, bonus will be equivalent to deposit of ₹10,00,000)</p>

                                <p><strong>Referral Bonus:</strong><br />
                                    =&gt; Earn <strong>20%</strong> of your referred user's first deposit once they redeem at least 1 coupon from their first deposit bonus.<br />
                                    Example: If you refer someone who deposits ₹10,000, you earn ₹2,000 referral bonus. This is converted to awaiting bonus once the user redeems ₹1,000 bonus coupons.<br />
                                    =&gt; <strong>20% of Reference Deposit</strong> or <strong>₹50,000</strong> (whichever is LESS) on <strong>200X True Rolling</strong> (Min Deposit: ₹2500)
                                </p>

                                <p><strong># True Rolling:</strong><br />
                                    =&gt; Calculated on every bet you place — it’s the lesser of exposure created or profit on that exposure.<br /><br />

                                    Back ₹10,000 on runner at rate 45 &rarr; Rolling Amount = ₹4,500<br />
                                    Lay ₹10,000 on runner at rate 35 &rarr; Rolling Amount = ₹3,500
                                </p>

                                <p><strong># For Fancy Market:</strong><br />
                                    Back ₹10,000 at even rate &rarr; Rolling = ₹10,000<br />
                                    Lay ₹10,000 at even rate &rarr; Rolling = ₹10,000<br />
                                    Back ₹10,000 at rate 90 &rarr; Rolling = ₹9,000<br />
                                    Lay ₹10,000 at rate 110 &rarr; Rolling = ₹10,000<br />
                                    Back ₹10,000 at rate 120 &rarr; Rolling = ₹10,000<br />
                                    Lay ₹10,000 at rate 60 &rarr; Rolling = ₹6,000
                                </p>

                                <p>
                                    - Max Rolling Amount: ₹10,000 per market or max bet limit at result time (whichever is LESS).<br />
                                    - Each session, bookmaker, and match odds = separate markets.<br />
                                    - Complete required rolling to convert Awaited Bonus into Bonus Chips.<br />
                                    - Bonus chips can be bet to win withdrawable balance, but chips themselves are non-withdrawable.
                                </p>

                                <p><strong>Bonus Eligibility:</strong><br />
                                    * Bets on Cricket, Football, and Tennis are eligible (including Match Odds and Bookmaker).<br />
                                    * No minimum odds or one-sided bet restrictions.<br />
                                    * All bonuses are split into <strong>10 equal coupons</strong>.<br />
                                    Example: ₹10,000 bonus = 10 coupons of ₹1,000 each.<br />
                                    Each coupon redeemable after completing required True Rolling.<br />
                                    * Awaited Bonus expires in <strong>14 days</strong>.
                                </p>

                                <p><strong># Conditions:</strong><br />
                                    =&gt; New users using same device for multiple accounts will not receive First Deposit Bonus.<br />
                                    =&gt; Bonus cannot be combined with other promotions.<br />
                                    =&gt; Void/Cancelled/Draw bets are not counted for bonus.<br />
                                    =&gt; Terms & Conditions apply as per company policy.<br />
                                    =&gt; Management reserves right to modify or cancel this promotion at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}