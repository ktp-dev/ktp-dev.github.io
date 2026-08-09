import Header from '../../components/Header';
import Footer from '../../components/Footer';

const linkClass = 'text-[#315CA9] hover:underline break-words';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-6 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16">
        <article className="max-w-3xl mx-auto font-inter text-gray-600 leading-relaxed">
          <h1 className="text-3xl sm:text-5xl font-black text-center text-black mb-3" style={{ letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p className="text-center text-gray-500 font-medium mb-10">Last updated August 09, 2026</p>

          <p className="mb-4">
            This Privacy Notice for Kappa Theta Pi - University of Michigan (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your personal information when you use our services (&quot;<strong>Services</strong>&quot;), including when you:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Visit our website at{' '}
              <a className={linkClass} href="https://www.ktpmichigan.com/" target="_blank" rel="noopener noreferrer">
                https://www.ktpmichigan.com/
              </a>{' '}
              or any website of ours that links to this Privacy Notice
            </li>
            <li>
              Use Kappa Theta Pi at the University of Michigan. The official website for Kappa Theta Pi at the University of Michigan, providing information about the organization, members, events, recruitment, and other chapter activities.
            </li>
            <li>Engage with us in other related ways, including any marketing or events</li>
          </ul>
          <p className="mb-10">
            <strong>Questions or concerns? </strong>
            Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>.
          </p>

          <h2 className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            SUMMARY OF KEY POINTS
          </h2>
          <p className="mb-4">
            <strong><em>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our </em></strong>
            <a className={linkClass} href="#toc"><strong><em>table of contents</em></strong></a>
            <strong><em> below to find the section you are looking for.</em></strong>
          </p>
          <p className="mb-4">
            <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about{' '}
            <a className={linkClass} href="#personalinfo">personal information you disclose to us</a>.
          </p>
          <p className="mb-4">
            <strong>Do we process any sensitive personal information? </strong>
            Some of the information may be considered &quot;special&quot; or &quot;sensitive&quot; in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
          </p>
          <p className="mb-4">
            <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
          </p>
          <p className="mb-4">
            <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about{' '}
            <a className={linkClass} href="#infouse">how we process your information</a>.
          </p>
          <p className="mb-4">
            <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn more about{' '}
            <a className={linkClass} href="#whoshare">when and with whom we share your personal information</a>.
          </p>
          <p className="mb-4">
            <strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about{' '}
            <a className={linkClass} href="#infosafe">how we keep your information safe</a>.
          </p>
          <p className="mb-4">
            <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about{' '}
            <a className={linkClass} href="#privacyrights">your privacy rights</a>.
          </p>
          <p className="mb-4">
            <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a{' '}
            <a className={linkClass} href="https://app.termly.io/dsar/8a1e8126-8f10-487b-b071-887a247c819d" rel="noopener noreferrer" target="_blank">data subject access request</a>
            , or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
          </p>
          <p className="mb-10">
            Want to learn more about what we do with any information we collect?{' '}
            <a className={linkClass} href="#toc">Review the Privacy Notice in full</a>.
          </p>

          <h2 id="toc" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            TABLE OF CONTENTS
          </h2>
          <div className="space-y-1 mb-10">
            <p><a className={linkClass} href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a></p>
            <p><a className={linkClass} href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a></p>
            <p><a className={linkClass} href="#whoshare">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></p>
            <p><a className={linkClass} href="#cookies">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></p>
            <p><a className={linkClass} href="#sociallogins">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></p>
            <p><a className={linkClass} href="#inforetain">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a></p>
            <p><a className={linkClass} href="#infosafe">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></p>
            <p><a className={linkClass} href="#infominors">8. DO WE COLLECT INFORMATION FROM MINORS?</a></p>
            <p><a className={linkClass} href="#privacyrights">9. WHAT ARE YOUR PRIVACY RIGHTS?</a></p>
            <p><a className={linkClass} href="#DNT">10. CONTROLS FOR DO-NOT-TRACK FEATURES</a></p>
            <p><a className={linkClass} href="#uslaws">11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></p>
            <p><a className={linkClass} href="#policyupdates">12. DO WE MAKE UPDATES TO THIS NOTICE?</a></p>
            <p><a className={linkClass} href="#contact">13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></p>
            <p><a className={linkClass} href="#request">14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></p>
          </div>

          <h2 id="infocollect" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            1. WHAT INFORMATION DO WE COLLECT?
          </h2>
          <h3 id="personalinfo" className="text-lg font-bold text-black mt-6 mb-3 scroll-mt-24">
            Personal information you disclose to us
          </h3>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>We collect personal information that you provide to us.</em>
          </p>
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>
          <p className="mb-4">
            <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>names</li>
            <li>email addresses</li>
            <li>contact or authentication data</li>
          </ul>
          <p id="sensitiveinfo" className="mb-4 scroll-mt-24">
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </p>
          <p className="mb-4">
            <strong>Social Media Login Data. </strong>
            We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called &quot;
            <a className={linkClass} href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a>
            &quot; below.
          </p>
          <p className="mb-4">
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Google API</h3>
          <p className="mb-10">
            Our use of information received from Google APIs will adhere to{' '}
            <a className={linkClass} href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener noreferrer" target="_blank">
              Google API Services User Data Policy
            </a>
            , including the{' '}
            <a className={linkClass} href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" rel="noopener noreferrer" target="_blank">
              Limited Use requirements
            </a>
            .
          </p>

          <h2 id="infouse" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            2. HOW DO WE PROCESS YOUR INFORMATION?
          </h2>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</em>
          </p>
          <p className="mb-4">
            <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
          </p>
          <ul className="list-disc pl-6 mb-10 space-y-2">
            <li>
              <strong>To facilitate account creation and authentication and otherwise manage user accounts. </strong>
              We may process your information so you can create and log in to your account, as well as keep your account in working order.
            </li>
            <li>
              <strong>To deliver and facilitate delivery of services to the user. </strong>
              We may process your information to provide you with the requested service.
            </li>
            <li>
              <strong>To respond to user inquiries/offer support to users. </strong>
              We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.
            </li>
            <li>
              <strong>To protect our Services.</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.
            </li>
          </ul>

          <h2 id="whoshare" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </h2>
          <p className="mb-4">
            <strong><em>In Short:</em></strong>
            <em> We may share information in specific situations described in this section and/or with the following third parties.</em>
          </p>
          <p className="mb-4">
            <strong>Vendors, Consultants, and Other Third-Party Service Providers.</strong> We may share your data with third-party vendors, service providers, contractors, or agents (&quot;<strong>third parties</strong>&quot;) who perform services for us or on our behalf and require access to such information to do that work.
          </p>
          <p className="mb-4">The third parties we may share personal information with are as follows:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Allow Users to Connect to Their Third-Party Accounts</strong>
              <div>Google account</div>
            </li>
            <li>
              <strong>Cloud Computing Services</strong>
              <div>Supabase</div>
            </li>
            <li>
              <strong>User Account Registration and Authentication</strong>
              <div>Google Sign-In and Supabase</div>
            </li>
            <li>
              <strong>Website Hosting</strong>
              <div>Vercel</div>
            </li>
          </ul>
          <p className="mb-4">We also may need to share your personal information in the following situations:</p>
          <ul className="list-disc pl-6 mb-10 space-y-2">
            <li>
              <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </li>
          </ul>

          <h2 id="cookies" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
          </h2>
          <p className="mb-4">
            <strong><em>In Short:</em></strong>
            <em> We may use cookies and other tracking technologies to collect and store your information.</em>
          </p>
          <p className="mb-4">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
          </p>
          <p className="mb-4">
            We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements or to tailor advertisements to your interests. The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
          </p>
          <p className="mb-4">
            To the extent these online tracking technologies are deemed to be a &quot;sale&quot;/&quot;sharing&quot; (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section &quot;
            <a className={linkClass} href="#uslaws">DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a>
            &quot;
          </p>
          <p className="mb-10">
            Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>

          <h2 id="sociallogins" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
          </h2>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em>
          </p>
          <p className="mb-4">
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
          </p>
          <p className="mb-10">
            We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
          </p>

          <h2 id="inforetain" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            6. HOW LONG DO WE KEEP YOUR INFORMATION?
          </h2>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
          </p>
          <p className="mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
          </p>
          <p className="mb-10">
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </p>

          <h2 id="infosafe" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            7. HOW DO WE KEEP YOUR INFORMATION SAFE?
          </h2>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>We aim to protect your personal information through a system of organizational and technical security measures.</em>
          </p>
          <p className="mb-10">
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
          </p>

          <h2 id="infominors" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            8. DO WE COLLECT INFORMATION FROM MINORS?
          </h2>
          <p className="mb-4">
            <strong><em>In Short:</em></strong>
            <em> We do not knowingly collect data from or market to children under 18 years of age.</em>
          </p>
          <p className="mb-10">
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>.
          </p>

          <h2 id="privacyrights" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            9. WHAT ARE YOUR PRIVACY RIGHTS?
          </h2>
          <p className="mb-4">
            <strong><em>In Short:</em></strong>
            <em> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em>
          </p>
          <p id="withdrawconsent" className="mb-4 scroll-mt-24">
            <strong><u>Withdrawing your consent:</u></strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section &quot;
            <a className={linkClass} href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
            &quot; below.
          </p>
          <p className="mb-4">
            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Account Information</h3>
          <p className="mb-4">If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Contact us using the contact information provided.</li>
          </ul>
          <p className="mb-4">
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
          </p>
          <p className="mb-4">
            <strong><u>Cookies and similar technologies:</u></strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.
          </p>
          <p className="mb-10">
            If you have questions or comments about your privacy rights, you may email us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>.
          </p>

          <h2 id="DNT" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            10. CONTROLS FOR DO-NOT-TRACK FEATURES
          </h2>
          <p className="mb-4">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
          </p>
          <p className="mb-10">
            California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.
          </p>

          <h2 id="uslaws" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </h2>
          <p className="mb-4">
            <strong><em>In Short: </em></strong>
            <em>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</em>
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Categories of Personal Information We Collect</h3>
          <p className="mb-4">
            The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section &quot;
            <a className={linkClass} href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a>
            &quot;
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-200 bg-[#F6FBFF] p-3 text-left font-bold text-black">Category</th>
                  <th className="border border-gray-200 bg-[#F6FBFF] p-3 text-left font-bold text-black">Examples</th>
                  <th className="border border-gray-200 bg-[#F6FBFF] p-3 text-left font-bold text-black">Collected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">A. Identifiers</td>
                  <td className="border border-gray-200 p-3 align-top">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                  <td className="border border-gray-200 p-3 align-top">YES</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">B. Personal information as defined in the California Customer Records statute</td>
                  <td className="border border-gray-200 p-3 align-top">Name, contact information, education, employment, employment history, and financial information</td>
                  <td className="border border-gray-200 p-3 align-top">YES</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">C. Protected classification characteristics under state or federal law</td>
                  <td className="border border-gray-200 p-3 align-top">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">D. Commercial information</td>
                  <td className="border border-gray-200 p-3 align-top">Transaction information, purchase history, financial details, and payment information</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">E. Biometric information</td>
                  <td className="border border-gray-200 p-3 align-top">Fingerprints and voiceprints</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">F. Internet or other similar network activity</td>
                  <td className="border border-gray-200 p-3 align-top">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">G. Geolocation data</td>
                  <td className="border border-gray-200 p-3 align-top">Device location</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">H. Audio, electronic, sensory, or similar information</td>
                  <td className="border border-gray-200 p-3 align-top">Images and audio, video or call recordings created in connection with our business activities</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">I. Professional or employment-related information</td>
                  <td className="border border-gray-200 p-3 align-top">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">J. Education Information</td>
                  <td className="border border-gray-200 p-3 align-top">Student records and directory information</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">K. Inferences drawn from collected personal information</td>
                  <td className="border border-gray-200 p-3 align-top">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual&apos;s preferences and characteristics</td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 align-top">L. Sensitive personal Information</td>
                  <td className="border border-gray-200 p-3 align-top"></td>
                  <td className="border border-gray-200 p-3 align-top">NO</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4">We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Receiving help through our customer support channels;</li>
            <li>Participation in customer surveys or contests; and</li>
            <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
          </ul>
          <p className="mb-4">We will use and retain the collected personal information as needed to provide the Services or for:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Category A - As long as the user has an account with us</li>
            <li>Category B - As long as the user has an account with us</li>
          </ul>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Sources of Personal Information</h3>
          <p className="mb-4">
            Learn more about the sources of personal information we collect in &quot;
            <a className={linkClass} href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a>
            &quot;
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">How We Use and Share Personal Information</h3>
          <p className="mb-4">
            Learn more about how we use your personal information in the section, &quot;
            <a className={linkClass} href="#infouse">HOW DO WE PROCESS YOUR INFORMATION?</a>
            &quot;
          </p>
          <p className="mb-4">
            <strong>Will your information be shared with anyone else?</strong>
          </p>
          <p className="mb-4">
            We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, &quot;
            <a className={linkClass} href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>
            &quot;
          </p>
          <p className="mb-4">
            We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be &quot;selling&quot; of your personal information.
          </p>
          <p className="mb-4">
            We have not sold or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We have disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Category A. Identifiers</li>
            <li>Category B. Personal information as defined in the California Customer Records law</li>
          </ul>
          <p className="mb-4">
            The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under &quot;
            <a className={linkClass} href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>
            &quot;
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Your Rights</h3>
          <p className="mb-4">
            You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Right to know</strong> whether or not we are processing your personal data</li>
            <li><strong>Right to access </strong>your personal data</li>
            <li><strong>Right to correct </strong>inaccuracies in your personal data</li>
            <li><strong>Right to request</strong> the deletion of your personal data</li>
            <li><strong>Right to obtain a copy </strong>of the personal data you previously shared with us</li>
            <li><strong>Right to non-discrimination</strong> for exercising your rights</li>
            <li><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California&apos;s privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)</li>
          </ul>
          <p className="mb-4">Depending upon the state where you live, you may also have the following rights:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
            <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
            <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
            <li>Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)</li>
            <li>Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)</li>
            <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
            <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
          </ul>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">How to Exercise Your Rights</h3>
          <p className="mb-4">
            To exercise these rights, you can contact us by submitting a{' '}
            <a className={linkClass} href="https://app.termly.io/dsar/8a1e8126-8f10-487b-b071-887a247c819d" rel="noopener noreferrer" target="_blank">data subject access request</a>
            , by emailing us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>
            , or by referring to the contact details at the bottom of this document.
          </p>
          <p className="mb-4">
            Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Request Verification</h3>
          <p className="mb-4">
            Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.
          </p>
          <p className="mb-4">
            If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">Appeals</h3>
          <p className="mb-4">
            Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>
            . We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.
          </p>
          <h3 className="text-lg font-bold text-black mt-6 mb-3">California &quot;Shine The Light&quot; Law</h3>
          <p className="mb-10">
            California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section &quot;
            <a className={linkClass} href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
            &quot;
          </p>

          <h2 id="policyupdates" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            12. DO WE MAKE UPDATES TO THIS NOTICE?
          </h2>
          <p className="mb-4">
            <em><strong>In Short: </strong>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
          </p>
          <p className="mb-10">
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </p>

          <h2 id="contact" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </h2>
          <p className="mb-4">
            If you have questions or comments about this notice, you may email us at{' '}
            <a className={linkClass} href="mailto:ktp-board@umich.edu">ktp-board@umich.edu</a>
            {' '}or contact us by post at:
          </p>
          <p className="mb-1">Kappa Theta Pi - University of Michigan</p>
          <p className="mb-1">530 S State St</p>
          <p className="mb-1">Ann Arbor, MI 48109</p>
          <p className="mb-10">United States</p>

          <h2 id="request" className="text-xl font-extrabold text-black mt-10 mb-4 scroll-mt-24" style={{ letterSpacing: '-0.02em' }}>
            14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
          </h2>
          <p className="mb-10">
            Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a{' '}
            <a className={linkClass} href="https://app.termly.io/dsar/8a1e8126-8f10-487b-b071-887a247c819d" rel="noopener noreferrer" target="_blank">data subject access request</a>.
          </p>

          <p>
            This Privacy Policy was created using Termly&apos;s{' '}
            <a className={linkClass} href="https://termly.io/products/privacy-policy-generator/" target="_blank" rel="noopener noreferrer">
              Privacy Policy Generator
            </a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
