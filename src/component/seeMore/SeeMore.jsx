import React, { useState } from 'react';

const SeeMoreLess = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(prev => !prev);
  };

  return (
    <div className='mx-5 md:mx-20' >
      <div className='text-[20px] font-bold text-start'>Online Sports Betting Exchange</div>
      <p className='text-[12px] py-2 '>
        India’s online betting exchange and casino company, ministerexch, is more than just a platform for betting enthusiasts,
        it transcends traditional betting by blending excitement and entertainment into every interaction.
      </p>
      <p className='text-[12px] py-2 '>
        We've mixed the thrill of betting exchange with the excitement of a sport and casino, creating an awesome
        experience just for you. We've got something for everyone, so your time with ministerexch is always special.
      </p>
      <p className='text-[12px] py-2 '>
        Our team, made up of experts, works hard to stay on top of the games, ensuring you're part of the most fun and thrilling experiences.
      </p>
      

      {showMore && (
        <div>
          <p className='text-[12px] py-2 '>
        Make Your Move, Bet Now! Zet. Set. Go!
      </p>
      <p className='text-[16px] py-2 font-semibold '>
        Why Choose ministerexch as Your Online Sports Betting Exchange Platform
      </p>
      <p className='text-[12px] py-2 '>
        With just one click, you can access live cricket, other sports, and casino betting on our user-friendly platform. Place Your Debut Bet with ministerexch Exchange! 
      </p>
      <p className='text-[14px] py-2 font-semibold '>Unmatched Variety
      </p>
      <p className='text-[12px] py-2 '>
        Explore a diverse selection of sports events and find the perfect match for your betting preferences, ministerexch has it all.
      </p>
      <p className='text-[14px] py-2 font-semibold '>
        Innovative Betting Exchange
      </p>
      <p className='text-[12px] py-2 '>ministerexch goes beyond traditional sports betting with our revolutionary betting exchange platform. Experience the power to set your odds, trade bets with fellow enthusiasts, and take control of your betting journey like never before.
      </p>
      <p className='text-[14px] py-2 font-semibold '>Live Betting Experience

      </p>
      <p className='text-[12px] py-2 '>
        Feel the adrenaline rush with our live betting feature. Get in the action, place bets in real time, and witness the game-changing moments that can turn the odds in your favour.
      </p>
      <p className='text-[14px] py-2 font-semibold '>Secure and Transparent
      </p>
      <p className='text-[12px] py-2 '>
      At ministerexch, we prioritise the safety and security of our users. Our robust platform ensures that your transactions are secure, and your data is protected. With transparent processes and fair play, you can bet with confidence, knowing that your success is determined by skill and strategy.
      </p>
      <p className='text-[14px] py-2 font-semibold '>Exclusive Bonuses/Promotions
      </p>
      <p className='text-[12px] py-2 '>Discover the great perks of our welcome offer and exciting promotional bonuses as you enjoy betting on global sports events.
      </p>
      <table className='border'>
        <thead>
          <tr>
            <td className='border border-black px-3 text-[12px] py-2'>Casino Bonus</td>
            <td className='border border-black px-3 text-[12px] py-2'>Welcome Bonus 500% upto ₹5000</td>
          </tr>
          <tr>
            <td className='border border-black px-3 text-[12px] py-2'>Re-Deposit Bonus</td>
            <td className='border border-black px-3 text-[12px] py-2'>Extra 3% upto ₹1500</td>
          </tr>
          <tr>
            <td className='border border-black px-3 text-[12px] py-2'>Refer & Earn</td>
            <td className='border border-black px-3 text-[12px] py-2'>₹1000</td>
          </tr>
        </thead>
      </table>
      <p className='text-[14px] py-2'>Additionally,
      </p>
      <ul className='ps-4'>
        <li className='list-disc text-[12px]'>We take pride in being one of the online betting companies accepting Indian rupees.</li>
        <li className='list-disc text-[12px]'>
          Our customer support is ready round the clock to help with any questions or worries.</li>
        <li className='list-disc text-[12px]'>You can trust that ministerexch is a fully licensed and legal online sports betting company that follows all the rules and regulations.</li>
        <li className='list-disc text-[12px]'>Experience a high acceptance rate with our fastest matching bet feature, ensuring your odds are matched swiftly.</li>
        <p className='text-[14px] py-2'>
          Besides, we offer GUARANTEED WITHDRAWAL UNDER 45 MINUTES.
        </p>
      </ul>
      
      <p className='text-[16px] py-2 font-semibold '>
        How to Get Started with India’s Online Sports Betting Company
      </p>
      <p className='text-[14px]'>
        Getting started on your betting adventure with an online sports betting company in India, ministerexch is remarkably simple, and you can break it down into a few easy-to-follow steps. Let's explore the process in detail to ensure you have a clear understanding of how to kick off your journey on ministerexch.
      </p>
      <p className='text-[14px] py-2 font-semibold '>Step 1: Registration
      </p>
      <p className='text-[14px]'>
          To begin, you'll need to create an account on the ministerexch platform. This involves providing basic personal information, such as your name, email address, and preferred login details. Make sure to use accurate details to ensure a smooth and secure registration process.
      </p>
      <p className='text-[14px] py-2 font-semibold '>Step 2: Verification
      </p>
      <p className='text-[14px]'>
        After registering, you may be required to verify your account. This step helps ensure the security of your account and is a standard procedure on many online platforms. Verification typically involves confirming your identity by providing additional documents, such as a copy of your ID.   
      </p>
      <p className='text-[14px] py-2 font-semibold '>Step 3: Deposit Funds
      </p>
      <p className='text-[14px]'>
        Once your account is verified, it's time to add funds to your ministerexch account. You can choose from a variety of payment methods, including UPI, GPay, PhonePe, Paytm, and bank transfers.   
      </p>
      <p className='text-[14px] py-2 font-semibold '>Step 4: Welcome Bonus
      </p>
      <p className='text-[14px]'>
        Once you've made your first deposit, it's time to benefit from your 500% welcome bonus. In addition, you can get 3% extra bonus every day one time on  deposit you make  
      </p>
      <p className='text-[14px] py-2 font-semibold '>Step 5: Explore Betting Markets
      </p>
      <p className='text-[14px]'>
          With funds in your account, you can now explore the diverse range of betting markets offered by ministerexch. From sports events to casino games, the platform provides a wide array of options for users to place their bets. Take some time to familiarise yourself with the available markets and choose the ones that align with your interests.  
      </p>
        <p className='text-[14px] py-2 font-semibold '>Step 6: Place Your Bets
        </p>
        <p className='text-[14px]'>
          After selecting your preferred markets, you can start placing your bets. ministerexch offers a user-friendly interface that makes the betting process straightforward. Simply choose the outcome you want to bet on, enter your stake, and confirm your bet.
        </p>
        <p className='text-[14px] py-2 font-semibold '>Monitor and Manage Your Bets
        </p>
        <p className='text-[14px]'>
          Once your bets are placed, you can monitor their progress in real-time. ministerexch provides live updates and detailed statistics to help you stay informed.
        </p>
        <p className='text-[16px] py-2 font-semibold '>Online Betting Exchange & Casino Platform Offerings
        </p>
        <p className='text-[14px]'>
          Get into an unforgettable sports betting exchange experience with ministerexch! You'll have many exciting options, ensuring that you'll keep coming back for more.
        </p>
        <p className='text-[14px] py-2 font-semibold '>Sports Betting Exchange
        </p>
        <p className='text-[14px]'>Place your online bets on sports games like cricket, football, tennis, and horse racing. With several betting options and competitive odds, we ensure you have ample opportunities to test your cricket knowledge and intuition.
        </p>
        
      <ul className='ps-4'>
        <li className='list-disc text-[12px]'>Cricket: Get ready for some cricket action, with a bunch of exciting options to bet on such as the IPL 2024. Get ready for the T20 excitement of the Indian Premier League with the latest odds and expert betting tips. Stay ahead of the game with insights into team form, player performances, and match analyses. Whether you're looking for favourable Indian Premier League odds or strategic advice, access everything you need to enhance your IPL betting experience and maximize your chances of success.</li>
        <li className='list-disc text-[12px]'>
        Football: We cover both international and local leagues, so you won't miss any of the action..</li>
        <li className='list-disc text-[12px]'>
          Tennis: Dive into the thrilling world of betting on Grand Slam events and ATP tournaments.</li>
        <li className='list-disc text-[12px]'>Horse Racing: Step into the global excitement of horse racing, where tradition, thrill, and high-stakes betting come together seamlessly.</li>
      </ul>
        <p className='text-[14px] py-2 font-semibold '>Live Casino
        </p>
        <p className='text-[14px]'>
          Play teen patti, andar bahar, roulette, and 100+ games with professional dealers. Chat live with dealers and players to add a social element to your gameplay.
        </p>
          <p className='text-[16px] py-2 font-semibold '>Sports Betting Exchange Markets
        </p>
        <p className='text-[14px]'>
          ministerexch’s online sports betting exchange platform provides a platform where users can bet against each other rather than against a traditional bookmaker. This creates several unique markets:
        </p>
        <p className='text-[14px]'>Back and Lay Markets:
        </p>
        <ul className='ps-4'>
          <li className='list-disc text-[12px]'>
            Back Bet: Users bet on a particular outcome, similar to traditional betting.</li>
          <li className='list-disc text-[12px]'>
            Lay Bet: Users bet against the possibility of an outcome
            </li>
        </ul>
        <p className='text-[14px]'>
          Match Odds: Betting on the outcome of a specific match, including win, lose, or draw.
        </p>
        <p className='text-[14px]'>Over/Under Markets: Betting on the total score or other numeric outcomes exceeding (Over) or falling short (Under) of a specified value.
        </p>
        <p className='text-[14px]'>Asian Handicap: A type of spread betting, levelling the playing field by giving a virtual advantage or disadvantage to a team.
        </p>
        <p className='text-[14px]'>In-Play or Live Betting: Betting on events as they unfold during a match, providing dynamic and real-time opportunities.
        </p>
        <p className='text-[14px]'>Outright Markets: Betting on the overall outcome of a tournament or league, such as the winner of a championship
        </p>
          <p className='text-[16px] py-2 font-semibold '>Casino Game Providers at ministerexch.in
        </p>
        <p className='text-[14px]'>As an online casino company, we take pride in partnering with top Casino Game Providers to offer our players a diverse and thrilling gaming experience.
        </p> 
        <p className='text-[14px] py-2 font-semibold '>Evolution Gaming
        </p>
        <p className='text-[14px]'>
          Renowned for its cutting-edge technology and professional dealers, Evolution Gaming delivers an authentic and engaging casino experience from the comfort of your own home. Live Roulette, blackjack, and baccarat are a few games provided by Evolution Gaming.
        </p> 
        <p className='text-[14px] py-2 font-semibold '>Ezugi
        </p>
        <p className='text-[14px]'>With a commitment to quality streaming and a diverse selection of games, Ezugi adds an extra layer of excitement to your online gaming adventure. Andar Bahar and Teen Patti are a few popular casino games provided by Ezugi.
        </p> 
        <p className='text-[14px] py-2 font-semibold '>Aura Gaming
        </p>
        <p className='text-[14px]'>
          From thrilling slots to engaging table games, Aura Gaming crafts an immersive experience that keeps players coming back for more.
        </p>
        <p className='text-[14px] py-2 font-semibold '>Aviator by Spribe
        </p>
        <p className='text-[14px]'>Known for their innovative approach, Spribe brings you an exciting and fast-paced game that combines elements of skill and chance. With exciting card and dice games, Aviator offers a refreshing break from traditional casino games, providing an exciting experience for players seeking something new and thrilling.
        </p> 
          <p className='text-[14px] py-2 font-semibold '>
            Join ministerexch: Your Place to Bet, Connect & Win Together
        </p>
        <p className='text-[14px]'>Be a part of the ultimate online sports betting exchange community at ministerexch, where your winning odds are not just a statistic – they're your key to an exhilarating and rewarding betting experience! Join ministerexch today!
        </p>  
        <p className='text-[16px] py-2 font-semibold '>
            FAQs related to Online Sports Betting Exchange
        </p> 
        <p className='text-[14px] font-semibold'>
          1. What is a sports betting exchange?
        </p>
        <p className='text-[14px]'>A sports betting exchange is a platform that allows users to bet against each other rather than against the bookmaker. Users can both back (bet for) and lay (bet against) outcomes, creating a marketplace for odds.
        </p>
        <p className='text-[14px] font-semibold'>
          2. How does ministerexch’s online betting exchange differ from a traditional sportsbook?
        </p>
        <p className='text-[14px]'>In a traditional sportsbook, users bet against the bookmaker, while in a betting exchange, users bet against each other. Exchanges offer more flexibility as users can set their own odds and either back or lay a particular outcome.
        </p>  
          <p className='text-[14px] font-semibold'>3. Why does a user want to bet on the ministerexch exchange in India?</p>
          <p className='text-[12px] py-2 '>
            That’s because online sports betting exchange offers better odds, the ability to lay bets and act as a
            bookmaker, the flexibility to set your own odds, and the potential for higher returns due to the absence
            of a traditional bookmaker's margin.
          </p>

          <p className='text-[14px] font-semibold'>4. Is the ministerexch betting exchange safe in India?</p>
          <p className='text-[12px] py-2 '>
            Certainly! ministerexch withdrawals are not only safe but also provide a seamless experience in India. We take
            pride in offering guaranteed withdrawals within 45 minutes. Players have a multitude of options to
            conveniently withdraw their winnings using our encrypted and secure payment methods. Rest assured, our
            reliability and speed are second to none. Although withdrawal times may vary based on the chosen method,
            you can expect a prompt and efficient process throughout.
          </p>

          <p className='text-[14px] font-semibold'>5. Can I place in-play (live) bets on the ministerexch betting exchange platform?</p>
          <p className='text-[12px] py-2 '>
            Yes, ministerexch allows in-play betting, enabling users to place bets while the event is in progress.
          </p>
        </div>
      )}
      <div className='flex justify-center pb-12'>
        <button className=''
          onClick={handleToggle}
          style={{
            marginTop: '10px',
            padding: '4px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'semibold'
          }}
        >
        {showMore ? 'See Less' : 'See More'}
      </button>
      </div>
    </div>
  );
};

export default SeeMoreLess;
