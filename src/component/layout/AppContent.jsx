import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../../pages/dashboard/Dashboard'
import InPlayMatch from '../../pages/in_play/InPlayMatch'
import Signup from '../../pages/signup/Signup'
import Profile from '../../pages/profile/Profile'
import AccountSatement from '../../pages/accountstatement/AccountStatement'
import MarketAnalysis from '../../pages/marketAnalysis/MarketAnalysis'
import ReferAndEarn from '../../pages/referAndEarn/ReferAndEarn'
import AllCasino from '../../pages/allCasino/AllCasino'
import SportsBook from '../../pages/sportsBook/SportsBook'
import ViewMatches from '../../pages/viewMatch/ViewMatch'
import InplaySport from '../../pages/inplay/InplaySport'
import UnsettledBets from '../../pages/unsettledBets/UnsettledBets'
import ProfitLoss from '../../pages/profitloss/ProfitLoss'
import ViewMatchRacing from '../../pages/viewMatch/ViewMatchRacing'
import BonusList from '../../pages/bonusList/BonusList'
import ChangePassword from '../profile/ChangePassword'
import Wallet from '../../pages/Wallet/Wallet'
import { Faq } from '../../pages/Faq/Faq'
import { ReferAFriend } from '../../pages/ReferAFriend/ReferAFriend'
import Refferal from '../../pages/Refferal/Refferal'
import Referral1 from '../../pages/Referral1/Referral1'
import WhyChooseUs from '../../pages/WhyChooseUs/WhyChooseUs'
import Deposit from '../../pages/Deposit/Deposit'
import BetHistory from '../../pages/BetHistory/BetHistory'
import EditStack from '../../pages/Editstack/EditStack'
import ActiveLogs from '../../pages/ActiveLog/ActiveLog'
import CasinoListByProviderName from '../../pages/casinoListByProviderName/CasinoListByProviderName'
import TrmCondtion from '../../pages/TrmCondtion/TrmCondtion'
import Promotions from '../../pages/Promotions/Promotions'
import PrivecyPolicy from '../../pages/privacyPolicy/PrivacyPolicy'
import Rules from '../../pages/rules/Rules'
import AboutsUs from '../../pages/aboutUs/AboutUs'
import ContactUs from '../../pages/contact/ContactUs'
import Mfa from '../../pages/Mfa/Mfa'
import Login from '../login/Login'
import ResponsibleGaming from '../../pages/ResponsibleGaming/ResponsibleGaming'
import IframeCasino from '../../pages/IframeCasino/IframeCasino'
import IframeCasinonew from '../../pages/IframeCasino/IframeCasinonew'
import IframeQtech from '../../pages/IframeCasino/IframeQtech'
import AllGamesCasino from '../../pages/allCasino/AllGamesCasino'
import Ledger from '../../pages/profitloss/Ledger'
import LedgerDetails from '../../pages/profitloss/LedgerDetails'
import InternationalLedgerDetails from '../../pages/profitloss/InternationalLedgerDetails'
import LedgerCasinoDetails from '../../pages/profitloss/LedgerCasinoDetails'





const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/referral" element={<Referral1 />} />
      <Route path='/referAFriend' element={<ReferAFriend />} />
      <Route path='/changepassword' element={<ChangePassword />} />
      <Route path='/ac-statement' element={<AccountSatement />} />
      <Route path='/why-choose-us' element={<WhyChooseUs />} />
      <Route path="/term-condition" element={<TrmCondtion />} />
      <Route path="/privacy-policy" element={<PrivecyPolicy />} />
      <Route path="/responsible-gambling" element={<ResponsibleGaming />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/about-us" element={<AboutsUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
{/* <Route path="/login" element={<Login />} /> */}
      
      <Route path="/promotions" element={<Promotions />} />
      <Route path='/refer-and-earn' element={<ReferAndEarn />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/bet-list" element={<BetHistory />} />
      <Route path="/setting" element={<EditStack />} />
      <Route path="/mfa" element={<Mfa />} />
      <Route path="/active-logs" element={<ActiveLogs />} />
      <Route path='/sport-view/:marketId?/:eventId?/:sportId?' element={<ViewMatches />} />
      <Route path='/sport-view-racing/:marketId?/:eventId?/:sportId?' element={<ViewMatchRacing />} />
      <Route path='/faq' element={<Faq />} />
      <Route path='/all-casino' element={<AllCasino />} />
      <Route path='/casino-list-by-providername/:providername?' element={<CasinoListByProviderName />} />
      <Route path='/sports-book' element={<SportsBook />} />
      <Route path='/market-analysis' element={<MarketAnalysis />} />
      <Route path='/bonus-list' element={<BonusList />} />
      <Route path='/in-play/:gameId?' element={<InPlayMatch />} />
      <Route path='/sports_book' element={<InplaySport />} />
      <Route path='/unsettled-bets' element={<UnsettledBets />} />
      <Route path='/refferal' element={<Refferal />} />
      <Route path='/profit-loss' element={<ProfitLoss />} />
      <Route path='/ledger' element={<Ledger />} />


      <Route path='/ledger-details/:marketId?' element={<LedgerDetails />} />
      <Route path='/ledger-casino-details/:eventId?/:ledgerType?/:date?' element={<LedgerCasinoDetails />} />
      <Route path='/international-ledger-casino-details/:eventId?/:ledgerType?/:date?' element={<InternationalLedgerDetails />} />


     
      <Route path="/casino" element={<AllGamesCasino />} />
            {/* <Route path="/iframe-casino/:gameId?" element={<IframeCasino />} />
            <Route path="/iframe-casino-new/:provider?/:gameId?"  element={<IframeCasinonew />} />
            <Route path="/iframe-qtech-casino/:gameId?"  element={<IframeQtech />} /> */}

    </Routes>

  )
}

export default React.memo(AppContent)