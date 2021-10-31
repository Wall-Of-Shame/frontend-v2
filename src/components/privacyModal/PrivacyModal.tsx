import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./PrivacyModal.scss";
import { close } from "ionicons/icons";
import logo from "../../assets/icon-192x192.png";

interface PrivacyModallProps {
  color: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const PrivacyModal: React.FC<PrivacyModallProps> = (
  props: PrivacyModallProps
) => {
  const { color, showModal, setShowModal } = props;

  return (
    <IonModal
      mode='ios'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color={color} mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => {
                setShowModal(false);
              }}
            >
              <IonIcon
                icon={close}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Privacy
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen scrollY={true}>
        <IonGrid className='ion-padding' style={{ marginTop: "0.5rem" }}>
          <IonRow
            className='ion-justify-content-center ion-align-items-center'
            style={{ marginBottom: "1rem" }}
          >
            <IonAvatar style={{ width: "5rem", height: "5rem" }}>
              <img src={logo} alt='Logo' />
            </IonAvatar>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText style={{ fontWeight: "600" }}>
              What does Wall of Shame do?
            </IonText>
          </IonRow>
          <IonRow
            className='ion-align-items-center'
            style={{ padding: "1rem" }}
          >
            <IonText>
              Wall of Shame is an application that allows you to challenge your
              friends and the public to complete tasks together, empowering you
              in your fight against procrastination. For more information about
              Wall of Shame, please see the About section of our landing page
              here.
            </IonText>
          </IonRow>
          <IonRow
            className='ion-align-items-center  ion-padding-horizontal'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontWeight: "600" }}>
              What personal information does Wall of Shame collect and why?
            </IonText>
          </IonRow>
          <IonRow
            className='ion-align-items-center'
            style={{ padding: "1rem" }}
          >
            <IonText>
              Wall of Shame takes its responsibilities under applicable privacy
              laws and regulations ("Privacy Laws") seriously and is committed
              to respecting the privacy rights and concerns of all Users of our
              Wall of Shame platform (the "Platform") (we refer to the Platform
              and the services we provide as described on our Platform
              collectively as the "Services"). We recognize the importance of
              the personal data you have entrusted to us and believe that it is
              our responsibility to properly manage, protect and process your
              personal data. This Privacy Policy (“Privacy Policy” or “Policy”)
              is designed to assist you in understanding how we collect, use,
              disclose and/or process the personal data you have provided to us
              and/or we possess about you, whether now or in the future, as well
              as to assist you in making an informed decision before providing
              us with any of your personal data.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText>
              This page is used to inform visitors regarding our policies with
              the collection, use, and disclosure of Personal Information if
              anyone decided to use our Service. If you choose to use our
              Service, then you agree to the collection and use of information
              in relation to this policy. The Personal Information that we
              collect is used for providing and improving the Service. We will
              not use or share your information with anyone except as described
              in this Privacy Policy.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We collect personal data directly from you only in the following
              scenarios:
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-end'>
            <ul>
              <li>
                When you use our products and services – when you have access to
                our products and services, we will collect your login
                credentials, including your email address (via email login) or
                social media account information (such as Google and Facebook
                usernames).
              </li>
              <li>
                When you interact with us – when you fill in a form on our
                website or a related Wall of Shame online page to: (i)
                participate in challenges in the platform, or (ii) when you seek
                help with technical issues, we collect the information you
                include in those forms. We may also use this data to let you
                know about any updates or changes to our products and services
                and/or to send you marketing communications about our products
                or services provided by us.
              </li>
              <li>
                Through cookies and similar technologies on our website – For
                the Wall of Shame website to work properly, you will need to
                ensure that your web browser is set to accept cookies. For
                detailed information on the cookies we use and the purposes for
                which we use them, please see our Cookie Policy.
              </li>
            </ul>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText style={{ fontWeight: "600" }}>
              Types of personal data we collect
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              How you interact with us and the different services that we offer
              determine what personal data we collect about you. The personal
              data we collect may consist of the following:
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-end'>
            <ul>
              <li>
                Email address (for email authentication) or social media account
                information (Google or Facebook accounts)
              </li>
              <li>
                User inputted content – content you provide to us when you use
                our services (for instance, if you contact our customer service
                teams or any information you choose to include about yourself in
                our services).
              </li>
              <li>
                Images uploaded - proof of completed challenges will be
                collected only for use within the challenge.
              </li>
            </ul>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText style={{ fontWeight: "600" }}>
              What happens to data we collect?
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              The personal data set out in this Privacy Policy is collected by
              Wall of Shame only insofar as is necessary or appropriate to
              fulfill the purpose for which it is collected as identified in
              this Privacy Policy. You can refuse to supply personal data to
              Wall of Shame at any time; however, it may prevent you from
              accessing Wall of Shame products and services.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We may collect, use, disclose and/or process your personal data
              for one or more of the following purposes:
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-end'>
            <ul>
              <li>
                To enforce our Terms of Service or any applicable end user
                license agreements;
              </li>
              <li>
                To protect personal safety and the rights, property or safety of
                others; For identification and/or verification;
              </li>
              <li>
                To maintain and administer any software updates and/or other
                updates and support that may be required from time to time to
                ensure the smooth running of our Services;
              </li>
              <li>
                To deal with or facilitate customer service, carry out your
                instructions, deal with or respond to any enquiries given by (or
                purported to be given by) you or on your behalf;
              </li>
              <li>
                To allow other Users to interact or connect with you on the
                Platform, including to inform you when another User has sent you
                a friend request;
              </li>
              <li>
                To conduct research, analysis and development activities
                (including, but not limited to, data analytics, surveys, product
                and service development and/or profiling), to analyse how you
                use our Services, to improve our Services or products and/or to
                enhance your customer experience;
              </li>
              <li>
                For marketing and in this regard, to send you by various modes
                of communication marketing and promotional information and
                materials relating to products and/or services (including,
                without limitation, products and/or services of third parties
                whom Wall of Shame may collaborate or tie up with) that Wall of
                Shame (and/or its affiliates or related corporations) may be
                selling, marketing or promoting, whether such products or
                services exist now or are created in the future. You can
                unsubscribe from receiving marketing information at any time by
                using the unsubscribe function within the electronic marketing
                material. We may use your contact information to send
                newsletters from us and from our related companies;
              </li>
              <li>
                To respond to legal processes or to comply with or as required
                by any applicable law, governmental or regulatory requirements
                of any relevant jurisdiction, including, without limitation,
                meeting the requirements to make disclosure under the
                requirements of any law binding on Wall of Shame or on its
                related corporations or affiliates;
              </li>
              <li>
                To produce statistics and research for internal and statutory
                reporting and/or record-keeping requirements;
              </li>
              <li>
                To carry out due diligence or other screening activities
                (including, without limitation, background checks) in accordance
                with legal or regulatory obligations or our risk management
                procedures that may be required by law or that may have been put
                in place by us;
              </li>
              <li>
                To prevent or investigate any actual or suspected violations of
                our Terms of Service, fraud, unlawful activity, omission or
                misconduct, whether relating to your use of our Services or any
                other matter arising from your relationship with us;
              </li>
              <li>
                To store, host, back up (whether for disaster recovery or
                otherwise) of your personal data, whether within or outside of
                your jurisdiction;
              </li>
              <li>
                To disclose your personal information to the following
                categories of recipients, including:
                <li>
                  Employees, contractors and affiliated organisations – that
                  need to know that information in order to process it on Wall
                  of Shame’s behalf. Our personnel are bound to confidentiality
                  terms which cover their obligations to protect personal data.
                </li>
                <li>
                  Group companies, third party service providers and partners –
                  who provide data processing services to us (for example, to
                  support the delivery of, provide functionality on, or help to
                  enhance the security of our website, events, and/or products
                  and services), or who otherwise process personal information
                  for purposes that are described in this Privacy Policy or
                  notified to you when we collect your personal data.
                </li>
                <li>
                  Government agencies, law enforcement, courts and other public
                  authorities – where we have a duty to disclose your personal
                  data by law.
                </li>
                <li>
                  Subscribers to our services – If your personal information is
                  collected from public sources for inclusion in or product
                  databases and any personal data you choose to provide to us
                  for display in our services (for example, in profiles and when
                  using online forums), your personal data will be accessed by
                  users of our products and services.
                </li>
              </li>
              <li>Any other person with your consent to the disclosure.</li>
              <li>
                Any other purposes which we notify you of at the time of
                obtaining your consent.
              </li>
            </ul>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText style={{ fontWeight: "600" }}>
              Our legitimate interests
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              Our legitimate interests in processing your personal data are
              mainly customer and product administration, provision, improvement
              and development of our services, protection of legal rights and
              marketing. More detailed information about these legitimate
              interests are set out below:
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-end'>
            <ul>
              <li>
                Customer and product administration: to provide you with our
                services and information that you requested or that you access
                through our services, create product accounts, provide user and
                technical support, enforce our terms of business, report product
                usage information to our customers and business partners, report
                to or content and technology providers, contact you about
                renewal of your subscriptions, and other related administrative
                tasks.
              </li>
              <li>
                Product personalisation: to deliver personalised functionality
                in our services, for example, we may retain your browsing and
                usage information to make your searches within our services more
                relevant. We also analyse product and services usage information
                to understand which content and tools are most useful for our
                users and to allow us to deliver and suggest tailored consent,
                features and other products and services we believe may be of
                interest to you.
              </li>
              <li>
                Marketing: to send you marketing messages for Wall of Shame
                products and services that may interest you. We do not disclose
                your contact information to third parties for their marketing
                purposes.
              </li>
              <li>
                Product content: to organize and include all information in our
                products and services we collect data from publicly available
                sources. We may also use personal data which you choose to make
                available in our services, for example, you may wish to provide
                information to enable peer connection and related collaboration.
              </li>
              <li>
                Security: to protect the security of our IT systems,
                architecture and networks as well as to prevent misuse of our
                products and services.
              </li>
              <li>
                Legal rights: to exercise our rights and to the extent
                reasonably required, to assist third parties (such as your
                employees or business partners) in exercising their rights, and
                to defend ourselves from claims and to comply with laws and
                regulations that apply to our group or third parties with whom
                we work.
              </li>
            </ul>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal'>
            <IonText style={{ fontWeight: "600" }}>
              Anonymous statistics
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We may anonymise your personal information for the purposes of
              internal analyses, for example product research to help us improve
              our products and services. We may in turn pass the anonymised data
              onto third parties including but not limited to Google Analytics,
              for the purposes of improving our products and services to you.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We may send you marketing communications, including but not
              limited to newsletters, and emails (“the Marketing
              Communications”), that will include service updates, advertising
              and offers related to our products and services which we believe
              you may be interested in. At any time, you may change your
              Marketing Communication preferences, by contacting our team
              directly by emailing wos.cs3216.2021@gmail.com or the “Contact Us”
              option, on our landing page, or the "Feedback" option on our app
              page.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              Aside from Marketing Communication, please note that from time to
              time, you may receive some important service information that we
              believe is critical to the use of our products and services. In
              these exceptional circumstances, such information will be sent to
              you regardless of your Marketing Communication preferences.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              If you send us a request (for example via a support email or via
              our feedback mechanisms), we reserve the right to publish it in
              order to help us clarify or respond to your request or to help us
              support other users.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              It is your responsibility to ensure that the information you
              submit to Wall of Shame is complete, accurate and up to date and
              it is your responsibility to notify us if that information
              changes.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We store your personal data throughout the period of your
              relationship with us and retain it for as long as necessary to
              fulfil the purposes for which we collected it, including for the
              purposes of satisfying legal, accounting or reporting obligations
              or to resolve disputes. If you wish to terminate your use of the
              product and services with Wall of Shame, please email us and we
              will take the necessary steps to delete your personal data in
              accordance with your legal rights.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              When we have no ongoing legitimate business need to process your
              personal data, we will either delete or anonymise it or, if this
              is not possible (for example, because your personal data has been
              stored in backup archives), then we will securely store your
              personal data and isolate it form any further processing until
              deletion is possible.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText style={{ fontWeight: "600" }}>Cookies</IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              Wall of Shame may place and access certain cookies on visitors.
              Wall of Shame uses cookies to help Wall of Shame identify and
              track visitors, their usage of Wall of Shame Website, and their
              website access preferences. The use of cookies helps us to improve
              the efficiency of Wall of Shame services. Wall of Shame visitors
              who do not wish to have cookies placed on their computers can
              choose to delete the cookies at any time by setting their browsers
              to refuse cookies before using Wall of Shame’s websites. However,
              please note that certain features of Wall of Shame’s websites may
              not function properly without the aid of cookies. For more
              information on how Wall of Shame uses cookies please visit our
              Cookie Policy.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText style={{ fontWeight: "600" }}>Security</IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We value your trust in providing us your Personal Information,
              thus we are striving to use commercially acceptable means of
              protecting it. User personal data is contained behind secured
              networks and is only accessible by a limited number of employees
              who have special access rights to such systems. However, there can
              be no guarantee of absolute security.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We will retain personal data in accordance with the Privacy Laws
              and/or other applicable laws. That is, we will destroy or
              anonymize your personal data when we have reasonably determined
              that (i) the purpose for which that personal data was collected is
              no longer being served by the retention of such personal data;
              (ii) retention is no longer necessary for any legal or business
              purposes; and (iii) no other legitimate interests warrant further
              retention of such personal data. If you cease using the Platform,
              or your permission to use the Platform and/or the Services is
              terminated or withdrawn, we may continue storing, using and/or
              disclosing your personal data in accordance with this Privacy
              Policy and our obligations under the Privacy Laws. Subject to
              applicable law, we may securely dispose of your personal data
              without prior notice to you.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText style={{ fontWeight: "600" }}>Children under 13</IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              Wall of Shame products and services are not directed to children
              under the age of thirteen (13). If a child below the age of 13 is
              found to be using Wall of Shame products and services, and
              personal data has been transmitted to us, Wall of Shame shall take
              the necessary steps to remove the personal data collected and
              terminate the Wall of Shame products and services provided.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText style={{ fontWeight: "600" }}>
              Changes to this Privacy Policy
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              We may update our Privacy Policy from time to time. Thus, you are
              advised to review this page periodically for any changes. We will
              notify you of any changes by posting the new Privacy Policy on
              this page.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              This policy is effective as of <strong>2021-10-31</strong>.
            </IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText style={{ fontWeight: "600" }}>Contact us</IonText>
          </IonRow>
          <IonRow className='ion-align-items-center ion-padding-horizontal ion-padding-top'>
            <IonText>
              If you have any concerns or questions with any of the terms within
              the Privacy Policy that you have just read, please do not hesitate
              to get in touch with us at wos.cs3216.2021@gmail.com and we will
              be able to answer any questions you might have.
            </IonText>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default PrivacyModal;
