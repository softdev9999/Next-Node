import Page from "components/Page/Page";
import Head from "next/head";
import Section from "components/Section/Section";
import withAppState from "components/Page/withAppState";

function TermsPage() {
    //use roomCode if we want to load dynamic data

    return (
        <Page>
            <Head>
                <title>Scener – Terms</title>
            </Head>

            <Section>
                <section className={"terms"}>
                    <div className={"container"}>
                        <br />

                        <h2>Legal Content</h2>
                        <ul>
                            <li>
                                <a href="#tos">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#privacy">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#community_guidelines">Scener Community Guidelines</a>
                            </li>
                            <li>
                                <a href="#cookies">Cookie Policy</a>
                            </li>
                        </ul>

                        <hr />

                        <a className={"anchor"} name="tos" id="tos"></a>
                        <h3>Terms of Service</h3>
                        <h4>Article I TERMS OF SERVICE</h4>
                        <p>Last modified: December 31, 2019</p>
                        <h4>Article II WELCOME TO SCENER</h4>
                        <p>
                            These Terms of Service are an agreement, entered into by and between you and Scener, Inc. ({"“"}We{"”"} or {"“"}Our{"”"}{" "}
                            or {"“"}Us), and govern your use of Scener™ and related products, features, apps, services, technologies, and software.{" "}
                        </p>
                        <ol>
                            <li>
                                Your Acceptance
                                <p>
                                    By using, visiting, or viewing Scener or any Scener products, software, data feeds or services provided to you
                                    from, on or through the Scener website or applications (collectively {"“"}Service{"”"}), you accept and agree to
                                    these Terms of Service and incorporated by this reference Our Privacy Policy at{" "}
                                    <a href="#privacy">scener.com/terms#privacy</a>.
                                </p>
                                <p>
                                    Please read the Terms of Service carefully because they govern your access to and use of Scener and all related
                                    services, content, functionalities offered on or through Scener, including any software, web browser extensions,
                                    mobile applications and related documentation.
                                </p>
                                <p>
                                    If you do not agree to all of the terms or conditions of these Terms of Service or the Privacy Policy, do not use
                                    the Service, as use constitutes acceptance.
                                </p>
                            </li>
                            <li>
                                Our Service
                                <p>
                                    Scener provides its users with a platform for content recommendations, co-watching and providing commentary. These
                                    Terms of Service apply to all users of the Service ({"“"}Users{"”"}). Users may contribute to the Service text,
                                    graphics, photos, sounds, music, videos, and other materials ({"“"}Content{"”"}) you may view on or access through
                                    the Service. We might not monitor or review all Content and We assume no responsibility for it. Except as
                                    described in these Terms of Service, We will not censor or edit materials from Users. By using the Service, you
                                    expressly relieve Us from any and all liability relating to your encounters or interaction with Content from
                                    Users.
                                </p>
                                <p>
                                    The Service may contain links to or interoperate with third-party websites that are not owned or controlled by Us.
                                    We have no control over, and assume no responsibility for, any third-party websites and the materials on them or
                                    their policies and practices. We encourage you to be aware and inform yourself of the relevant third-party website
                                    policies and agreements that you may encounter while you use Our Service. If a third-party website sets forth
                                    requirements, such as for membership, registration, or passwords, you must comply with the third-party website. We
                                    will not censor or edit materials from any third-party website. By using the Service, you expressly relieve Us
                                    from any and all liability relating to your use of any third-party websites.
                                </p>
                                <p>
                                    You may link to Our homepage, provided you do not do so in a way that suggests any form of association, approval
                                    or endorsement on Our part without Our express written consent. Other than allowed by the social media features
                                    provided by Us, you may not link to other pages on Our Service other than the homepage.
                                </p>
                                <p>
                                    The Service may provide certain social media features that enable you to:
                                    <ul>
                                        <li>Link from your own or certain third-party websites to certain Content on the Service;</li>
                                        <li>
                                            Send e-mails or other communications with certain Content, or links to certain Content, on the Service; or
                                        </li>
                                        <li>
                                            Cause limited portions of Content on the Service to be displayed or appear to be displayed on your own or
                                            certain third-party websites.
                                        </li>
                                    </ul>
                                </p>
                                <p>
                                    You may use these social media features solely as they are provided by Us. We may disable all or any social media
                                    features and any links at any time without notice at Our discretion.
                                </p>
                                <p>
                                    Subject to the terms and conditions herein, the Service We offer enables you to access certain features,
                                    functionality, and information, which may include, without limitation, providing you with the ability to:
                                    <ul>
                                        <li>
                                            Create and upload Content, including commentary and criticisms, and/or access Content that has been
                                            created by other Users;{" "}
                                        </li>
                                        <li>Access personalized information and Content, such as recommendations, suggestions and notifications; </li>
                                        <li>
                                            Create your own user profile and other content that may be visible to and/or shared with other Users; and{" "}
                                        </li>
                                        <li>Connect, communicate and interact with other Users on the Service.</li>
                                    </ul>
                                </p>
                                <p>
                                    The Service, including the website, Our trademarks, software, features, and functionality (including but not
                                    limited to all information, software, text, displays, images, video and audio, and the design, selection and
                                    arrangement thereof), are owned by Us, Our affiliates, Our licensors, or other providers of such material and are
                                    protected by United States and international copyright, trademark, patent, trade secret and other intellectual
                                    property or proprietary rights laws.
                                </p>
                                <p>
                                    You are permitted to use the Service for your personal, non-commercial use only. If We provide software to you as
                                    part the Service, then We grant you a non-exclusive license to install and use the software subject to the terms
                                    and conditions of this Terms of Service. You will not reproduce, distribute, modify, create derivative works of,
                                    publicly display, publicly perform, republish, download, store or transmit any of the material on the Service,
                                    except as are enabled by social media features (e.g. Facebook, Twitter) We provide.
                                </p>
                                <p>
                                    You will not:
                                    <ul>
                                        <li>
                                            Access or use for any commercial purposes any part of the Service or any materials available through the
                                            Service;
                                        </li>
                                        <li>Modify copies of any materials from the Service; or</li>
                                        <li>
                                            Delete or alter any copyright, trademark or other proprietary rights notices from copies of materials from
                                            the Service.
                                        </li>
                                    </ul>
                                </p>
                                <p>
                                    Any use of the Service not expressly permitted by these Terms of Service is a breach of these Terms of Service and
                                    may violate copyright, trademark and other laws.{" "}
                                </p>
                            </li>
                            <li>
                                Who Can Use Scener?
                                <p>
                                    If you are over 18 years old, Our Service is available to you, subject to other restrictions in this Terms of
                                    Service. Our Service is not offered to users who are 12 years old or younger. If you are a user between the ages
                                    of 13 and 18, review these Terms of Service with your parent or guardian. Your parent or guardian must agree to
                                    these Terms of Service on your behalf. By using the Service, you represent and warrant that you are of legal age
                                    to form a binding contract with Us or have the consent of your parent or guardian.
                                </p>
                                <p>
                                    If We have previously disabled your account for violations of Our Terms of Service or Privacy Policy, or for other
                                    reasons or policies, then you may not continue to use Our Service.{" "}
                                </p>
                                <p>
                                    We provide the Service for use only by persons located in the United States. We make no claims that the Service,
                                    the included software, or any of its Content is accessible, functional, compatible, or appropriate outside of the
                                    United States. Access to the Service may not be legal by certain persons or in certain countries. You may not use
                                    Our Service if you are prohibited by law from receiving Our products, services or software.{" "}
                                </p>
                            </li>
                            <li>
                                Your Scener Account
                                <p>
                                    We may remove or change the Service at Our sole discretion without notice. From time to time, We may restrict
                                    access to some parts or all of the Service to Users.
                                </p>
                                <p>
                                    To access the Service, you may be asked to provide information for account creation. It is a condition of your use
                                    of the Service that all the information you provide is correct, current, and complete. All information you provide
                                    to register with the Service or otherwise, including but not limited to through the use of any interactive
                                    features on the Service, is governed by <a href="#privacy">Our Privacy Policy</a>.
                                </p>
                                <p>
                                    You must treat your user name, password, and any other piece of information necessary to access the Service (your
                                    {"“"}Account Information{"”"}), as personal and confidential, and you must not disclose it to anyone. You will not
                                    provide any other person with access to the Service using your Account Information. You will notify Us immediately
                                    of any unauthorized access to or use of your Account Information or any other breach of security. We will not be
                                    liable for your losses caused by any unauthorized use of your account. However, you can be liable for the losses
                                    incurred by Us as a result of such unauthorized use.{" "}
                                </p>
                                <p>
                                    We have the right to disable your account and/or your Account Information at any time if, in Our opinion, you have
                                    violated any provision of the Terms of Service. We have the right to pursue any available legal process, where
                                    applicable, that arises due to the violation of these Terms of Service.{" "}
                                </p>
                            </li>
                            <li>
                                Content Shared through Service
                                <p>
                                    The Service contains interactive features that allow you to post, submit, publish, display or transmit ({"“"}Post
                                    {"”"}) Content. We do not guarantee any confidentiality in relation to these Posts. You will be solely responsible
                                    for your own Content and the consequences of Posting your Content. You affirm, represent, and warrant that you own
                                    or have the necessary licenses, rights, consents, and permissions to publish Content you Post; and you grant a
                                    limited license to Us of all patent, trademark, trade secret, copyright, or other proprietary rights in and to
                                    such Content as is necessary for Us to exercise the licenses you grant to Us in these Terms of Service.
                                </p>
                                <p>
                                    You agree that Content you Post to the Service will not contain third-party copyrighted material, or material that
                                    is subject to other third-party proprietary rights, unless you have permission from the rightful owner of the
                                    material or you are otherwise legally entitled to Post the material and to grant Us all of the license rights
                                    granted to us in operating the Service. You further agree that you will not Post to the Service any Content or
                                    other material that is contrary to applicable local, national, and international laws and regulations.
                                </p>
                                <p>
                                    We do not endorse any Content Posted to the Service by any User, or any opinion, recommendation, or advice
                                    expressed therein, and We expressly disclaim any and all liability in connection with Content. We will remove
                                    Content if properly notified that such Content infringes on another{"'"}s intellectual property rights. We reserve
                                    the right to remove Content without prior notice.
                                </p>
                            </li>
                            <li>
                                Permissions that You Give Us
                                <p>Permission to use Content you create and make available to public.</p>
                                <p>
                                    You own the Content you create and share on Scener. You may share your content with anyone else, in any manner
                                    that you choose. If you want to Post your Content on or through the Service, We require certain legal permissions.{" "}
                                </p>
                                <p>
                                    When you Post Content, you grant Us a non-exclusive, transferable, sub-licensable, royalty-free, and worldwide
                                    license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative
                                    works of your content (consistent with your privacy and other account settings).{" "}
                                </p>
                                <p>
                                    You can end this license any time by deleting your Content. You should know that, for technical reasons, Content
                                    you delete may persist for a limited period of time in backup copies (though it will not be visible to other
                                    Users).
                                </p>
                                <p>
                                    Permission to use your name and likeness; information about your actions with Our Service, ads and sponsored
                                    content.{" "}
                                </p>
                                <p>
                                    If you make Posts, you give us permission to use your name, likeness, voice, performance, quotations, and
                                    biography in the Posted Content. All information We collect on or through the Service is subject to Our{" "}
                                    <a className={"anchor"} name="tos">
                                        Privacy Policy
                                    </a>
                                    . By using the Service, you consent to all actions taken by Us with respect to your information in compliance with
                                    the Privacy Policy. If you are under the age of 18, a parent or legal guardian must agree to this section on your
                                    behalf for you to use the Service.
                                </p>
                                <p>Permission to update software you use or download. </p>
                                <p>
                                    If you download or use Our software, you give Us permission to download and install upgrades, updates, and
                                    additional features to improve, enhance, and further develop it.{" "}
                                </p>
                            </li>
                            <li>
                                Monitoring and Enforcement, Termination
                                <p>
                                    We have the right to:
                                    <ul>
                                        <li>Remove or refuse to post any Content for any or no reason at Our sole discretion.</li>
                                        <li>
                                            Take any action with respect to any Content that We deem necessary or appropriate at Our sole discretion,
                                            including if We believe that such Content violates the Terms of Service, infringes any intellectual
                                            property right or other right of anyone, threatens the personal safety of anyone or could create liability
                                            for Us.
                                        </li>
                                        <li>
                                            Disclose your identity or other information about you to any third party who claims that material posted
                                            by you violates their rights, including their intellectual property rights or their right to privacy, when
                                            required by applicable law.
                                        </li>
                                        <li>
                                            Take appropriate legal action, including without limitation, referral to law enforcement, for any illegal
                                            or damaging unauthorized use of the Service.{" "}
                                        </li>
                                        <li>
                                            Terminate or suspend your access to all or part of the Service for any violation of these Terms of
                                            Service.
                                        </li>
                                        <li>
                                            Decide whether Content violates these Terms of Service for reasons other than copyright infringement, such
                                            as, but not limited to, pornography, bigotry, or obscenity. We may at any time, without prior notice and
                                            at its sole discretion, remove such Content and/or terminate a User{"'"}s account for submitting such
                                            material in violation of these Terms of Service.
                                        </li>
                                    </ul>
                                    <p>
                                        We do not necessarily monitor or review use of Our Service by Users and/or promptly remove any Content that
                                        violates the above restrictions.{" "}
                                    </p>
                                    <p>
                                        Without limiting the foregoing, We have the right to fully cooperate with any law enforcement authorities or
                                        court order requesting or directing Us to disclose the identity or other information of anyone posting any
                                        materials on or through the Service.
                                    </p>
                                    <p>
                                        YOU WAIVE AND HOLD HARMLESS US, OUR AFFILIATES, LICENSORS, AND SERVICE PROVIDERS, AND THEIR RESPECTIVE
                                        OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS, LICENSORS, SUPPLIERS, SUCCESSORS AND ASSIGNS
                                        (COLLECTIVELY {"“"}RELEASED PARTIES{"“"}) FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN OR NOT TAKEN BY
                                        US/ANY OF THE FOREGOING PARTIES DURING OR AS A RESULT OF ITS INVESTIGATIONS CONCERNING THE ABOVE AND FROM ANY
                                        ACTIONS TAKEN AS A CONSEQUENCE OF INVESTIGATIONS BY EITHER US/SUCH PARTIES OR LAW ENFORCEMENT AUTHORITIES.
                                    </p>
                                </p>
                            </li>
                            <li>
                                Copyright Infringement
                                <p>
                                    If you are a copyright owner or an agent thereof and believe that any Content on the Service infringes upon your
                                    copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ({"“"}DMCA{"”"}) by
                                    providing Our Designated Copyright Agent (listed below) with the following required information in writing (see 17
                                    U.S.C. 512(c)(3) for further details):
                                    <ul>
                                        <li>
                                            A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive
                                            right that is allegedly infringed;
                                        </li>
                                        <li>
                                            Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works
                                            on the Service are covered by a single notification, a representative list of such works on the Service;
                                        </li>
                                        <li>
                                            Identification of the material that is claimed to be infringing or to be the subject of infringing
                                            activity and that is to be removed or access to which is to be disabled and information reasonably
                                            sufficient to permit Us to locate the material;
                                        </li>
                                        <li>
                                            Information reasonably sufficient to permit Us to contact you, such as an address, telephone number, and,
                                            if applicable, e-mail address;
                                        </li>
                                        <li>
                                            A statement that you have a good faith belief that use of the material in the manner complained of is not
                                            authorized by the copyright owner, its agent or the law; and
                                        </li>
                                        <li>
                                            A statement that the information in the notification is accurate, and under penalty of perjury, that you
                                            are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                                        </li>
                                    </ul>
                                </p>
                                <p>
                                    Written notification of claimed infringement must be submitted to the following Designated Agent:
                                    <blockquote>
                                        {" "}
                                        Copyright Compliance
                                        <br />
                                        Scener Inc.
                                        <br />
                                        999 3rd Ave, Suite 3300
                                        <br />
                                        Seattle, WA 98104 USA
                                        <br />
                                        Email: hello@scener.com
                                        <br />
                                    </blockquote>{" "}
                                </p>
                                <p>
                                    {" "}
                                    If you are a User and your Content was removed (or access thereto was disabled) due to a DMCA claim and you
                                    believe that your Content is not infringing, or that you have the authorization from the copyright owner, the
                                    copyright owner’s agent, or pursuant to applicable law, to make that Content available to Us for use on the
                                    Service, you may send a counter-notice containing the following information to Our Designated Agent:
                                    <ul>
                                        <li>Your physical or electronic signature;</li>
                                        <li>
                                            Identification of the content that has been removed or to which access has been disabled and the location
                                            at which the content appeared before it was removed or disabled;
                                        </li>
                                        <li>
                                            A statement that you have a good faith belief that the content was removed or disabled as a result of a
                                            mistake or a misidentification of the content; and
                                        </li>
                                        <li>
                                            Your name, address, telephone number, and, if applicable, e-mail address and a statement that you will
                                            accept service of process from the person who provided notification of the alleged infringement.
                                        </li>
                                    </ul>{" "}
                                </p>
                            </li>
                            <li>
                                Disclaimer of warranties
                                <p>
                                    You understand that We cannot and do not guarantee or warrant that files available for downloading from the
                                    Service, including the software, will be free of viruses or other destructive code. WE WILL NOT BE LIABLE FOR ANY
                                    LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES, OR OTHER TECHNOLOGICALLY HARMFUL
                                    MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA, OR OTHER PROPRIETARY MATERIAL DUE TO
                                    YOUR USE OF THE SERVICE, THE SOFTWARE, OR MATERIALS OBTAINED THROUGH THE SERVICE OR TO YOUR DOWNLOADING OF ANY
                                    MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT. YOUR USE OF THE SERVICE, CONTENT, THE SOFTWARE, ANY
                                    MATERIALS VIEWED OR OBTAINED THROUGH THE SERVICE, AND ANY WEBSITE LINKED IS AT YOUR OWN RISK. THE SERVICE,
                                    CONTENT, THE SOFTWARE, ANY MATERIALS VIEWED OR OBTAINED THROUGH THE SERVICE, AND ANY WEBSITE LINKED ARE PROVIDED
                                    ON AN {"“"}AS IS{"“"} AND {"“"}AS AVAILABLE{"“"} BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                                    IMPLIED. NEITHER WE NOR ANY PERSON ASSOCIATED WITH US MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE
                                    COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICE AND ALL OF THE ABOVE.
                                    WITHOUT LIMITING THE FOREGOING, NEITHER WE NOR ANYONE ASSOCIATED WITH US REPRESENTS OR WARRANTS THAT THE SERVICE,
                                    ITS CONTENT (INCLUDING CONTENT), THE SOFTWARE, ANY MATERIALS VIEWED OR OBTAINED THROUGH THE SERVICE, AND ANY
                                    WEBSITE LINKED WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR
                                    SITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICE,
                                    THE SOFTWARE, OR MATERIALS OBTAINED THROUGH THE SERVICE WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS. WE HEREBY
                                    DISCLAIMS ALL WARRANTIES OF ANY KIND TO THE FULLEST EXTENT OF THE LAW, WHETHER EXPRESS OR IMPLIED, STATUTORY OR
                                    OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR
                                    PARTICULAR PURPOSE.
                                </p>
                            </li>
                            <li>
                                Limitation on Liability
                                <p>
                                    IN NO EVENT WILL THE RELEASED PARTIES BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR
                                    IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE
                                    SERVICE, INCLUDING THE SOFTWARE, OR SUCH OTHER WEBSITES OR ANY MATERIALS VIEWED OR OBTAINED THROUGH THE SERVICE OR
                                    SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR PUNITIVE DAMAGES,
                                    INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF
                                    PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED
                                    BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT OR OTHERWISE, EVEN IF FORESEEABLE OR WE RECEIVED NOTICE. THE
                                    FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                                </p>
                            </li>
                            <li>
                                Indemnification
                                <p>
                                    You agree to defend, indemnify and hold harmless the Released Parties from and against any claims, liabilities,
                                    damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys’ fees) arising out of
                                    or relating to your violation of these Terms of Service or your use of the Service, including, but not limited to,
                                    your Content, any use of other Users{"'"} Content, the software, and products other than as expressly authorized
                                    in these Terms of Service or your use of any information obtained from the Service.
                                </p>
                            </li>
                            <li>
                                Governing Law and Jurisdiction
                                <p>
                                    All matters relating to the Service and these Terms of Service and any dispute or claim arising therefrom or
                                    related thereto, will be governed by and construed in accordance with the internal laws of the State of Washington
                                    without giving effect to any choice or conflict of law provision or rule (whether of the State of Washington or
                                    any other jurisdiction).
                                </p>
                                <p>
                                    Any legal suit, action or proceeding arising out of, or related to, these Terms of Service or the Service will be
                                    instituted exclusively in the federal courts of the United States or the courts of the State of Washington King
                                    County, although We retain the right to bring any suit, action or proceeding against you for breach of these Terms
                                    of Service in your country of residence or any other relevant country. You waive any and all objections to the
                                    exercise of jurisdiction over you by such courts and to venue in such courts.
                                </p>
                            </li>
                            <li>
                                Arbitration
                                <p>
                                    At Our sole discretion, We may require you to submit any disputes arising from the use of these Terms of Service,
                                    the Service, including the software, including disputes arising from or concerning their interpretation,
                                    violation, invalidity, non-performance, or termination, to final and binding arbitration under the Rules of
                                    Arbitration of the American Arbitration Association applying Washington State law.
                                </p>
                            </li>
                            <li>
                                Miscellaneous
                                <p>
                                    These Terms of Service constitute the complete and exclusive agreement between you and Us. No waiver or failure to
                                    assert a right by Us of any term or condition set forth in these Terms of Service will be deemed a further or
                                    continuing waiver of such term or condition or a waiver of any other term or condition. If any provision of these
                                    Terms of Service is held by a court or other tribunal of competent jurisdiction to be unenforceable for any
                                    reason, such provision will be eliminated or limited to the minimum extent such that the remaining provisions of
                                    the Terms of Service will continue in full force and effect.
                                </p>
                                <p>
                                    You cannot transfer any of your rights or obligations under this Terms Service to anyone without Our express
                                    consent.{" "}
                                </p>
                                <p>
                                    These Terms of Service do not confer any third-party beneficiary rights. All rights and obligations under this
                                    Terms of Service are freely assignable by Us in connection with a merger, acquisition, or sale of assets, by
                                    operation of law or otherwise.{" "}
                                </p>
                            </li>
                            <li>
                                Feedback for Scener
                                <p>
                                    You may contact us with any questions regarding the Service and your user registration and account:{" "}
                                    <a href="mailto:hello@scener.com">hello@scener.com</a>
                                </p>
                            </li>
                        </ol>

                        <a className={"anchor"} name="privacy" id="privacy"></a>
                        <h3>I. SCENER PRIVACY POLICY</h3>
                        <p>Last modified: December 31, 2019</p>
                        <p>
                            This Privacy Policy describes the way in which Scener, Inc. ({"“"}Scener{"”"}) collects and uses personal information when
                            you use Scener products, services and websites (collectively {"“"}Services{"”"}).
                        </p>
                        <p>
                            If you have any questions about our privacy policies and practices, we encourage you to contact us via the contact
                            information provided at the end of this Privacy Policy.
                        </p>
                        <ol>
                            <li>
                                Information We Collect About You and How We Use It.
                                <p>
                                    We collect information that is necessary to provide and improve our Services, to communicate with you, to conduct
                                    our operations effectively, and to support customer relations. Information collected may include:{" "}
                                </p>
                                <ul>
                                    <li>
                                        <span>Your personally identifiable information</span>. Your name and contact details, including your e-mail
                                        address, mailing address, telephone number and, where relevant, billing information, including a credit card
                                        number.{" "}
                                    </li>
                                    <li>
                                        <span>Your demographic information</span>. This might include gender identification or language preferences.
                                    </li>
                                    <li>
                                        <span>Information concerning your use of Scener Services</span>. This information may relate to photographs or
                                        videos you share, including the originating site of such photographs or videos, content you upload or view,
                                        your activities on video streaming sites when you interact with such site via our Services and activities on
                                        our websites such as pages visited, time and date.
                                    </li>
                                    <li>
                                        <span>Information about your hardware</span>. This might include information about your computers or mobile
                                        devices, such as your unique device ID (persistent/ non-persistent, MAC or IMEI), hardware, software,
                                        platform, and Internet Protocol (IP) address.
                                    </li>
                                </ul>
                                <p>
                                    While most of this data come directly from you, such as information you provide when you sign up for Services or
                                    information we gather when you use our Services, we sometimes receive information from third parties such as:
                                </p>
                                <ul>
                                    <li>
                                        Social networks (like Snapchat, Facebook and Twitter) and similar third-party services, that make users’
                                        information available to others;
                                    </li>
                                    <li>Partners with which we offer co-branded services or engage in joint-marketing activities;</li>
                                    <li>Advertisers who may share information about your experiences or interactions with their offerings; and</li>
                                    <li>
                                        Service providers that help us determine your device’s location based on its IP address to customize certain
                                        products to your location.
                                    </li>
                                </ul>
                                <p>
                                    We protect data obtained from third parties according to the practices described in this Privacy Policy, plus any
                                    additional restrictions imposed by the source of the data. When you are asked to provide personal information, you
                                    may decline. But if you choose not to provide information that is necessary to provide a service, you may not be
                                    able to use that service.
                                </p>
                                <p>
                                    Our services are not targeted at children and we do not intentionally or knowingly collect personal information
                                    from children under the age of 13.
                                </p>
                                <p>
                                    When using our Services, you may provide us with information about third persons which we may also collect. These
                                    circumstances might arise if you use our Services to connect with friends, family, or colleagues or if you use our
                                    Services to share content, including comments and criticisms, and this content contains personal information about
                                    third persons that is stored in order to permit sharing.{" "}
                                </p>
                            </li>

                            <li>
                                How Do We Use Your Personal Information?
                                <p>
                                    We use information to provide you with our Services, as well as to enable our operations. Such uses might include:{" "}
                                </p>
                                <ul>
                                    <li>Verifying your access rights;</li>
                                    <li>Determining whether your device meets our minimum system requirements;</li>
                                    <li>Permitting compatibility and interoperability;</li>
                                    <li>Billing you for our Services, where applicable;</li>
                                    <li>Initiating automatic updates to downloaded Services and products; </li>
                                    <li>Providing language and location customization;</li>
                                    <li>
                                        Developing aggregated statistics that help us better understand how our products are used and to market them;
                                    </li>
                                    <li>
                                        Improving our Services, including fixing problems and continually improving the performance of features you
                                        may use such as gesture recognition or content recommendations; and
                                    </li>
                                    <li>
                                        Communicating with you, such as sending you messages concerning your account and customer service issues,
                                        asking you to participate in surveys, and delivering news, updates, targeted advertising, promotions, and
                                        special offers.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                When and How We Share Personal Information with Third Parties.
                                <p>
                                    We will not share your personal information with third parties without your consent, except as necessary for the
                                    purposes set forth in this Privacy Policy. We may disclose personal information that we collect or you provide as
                                    described in this Privacy Policy:
                                </p>
                                <ul>
                                    <li>To our subsidiaries, affiliates, and potential buyers or other successors; or</li>
                                    <li>
                                        To contractors, service providers, analytics providers, and other third parties we use to support our business
                                        and who are bound by contractual obligations to keep personal information confidential and use it only for the
                                        purposes for which we disclose it to them.
                                    </li>
                                </ul>
                                <p>We may also disclose your personal information:</p>
                                <ul>
                                    <li>
                                        To comply with any court order, law, or legal process, including to respond to any government or regulatory
                                        request;
                                    </li>
                                    <li>
                                        To enforce or apply our Terms of Service and other agreements, including for billing and collection purposes;
                                        or
                                    </li>
                                    <li>
                                        If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of ourselves,
                                        our customers, or others.{" "}
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Analytics and Use of Cookies
                                <p>
                                    We also use third-party analytics providers such as Google Analytics and Mixpanel to help us compile aggregated
                                    statistics about the operation and effectiveness of our Services. Analytics providers set or read their own
                                    cookies, or other identifiers on your device, and transmit events through which they can collect information about
                                    your use of our websites and those of other companies.
                                </p>
                                <p>Learn more about our analytics providers:</p>
                                <ul>
                                    <li>
                                        You can learn more about Google Analytics, including how to opt-out, by visiting Google’s Privacy &amp; Terms
                                        for Partners or visit our Cookies Policy.{" "}
                                    </li>
                                </ul>
                                <p>
                                    If you search for specific content on the Scener website, the search terms may be embedded in the {"“"}search
                                    string{"“"}
                                    that appears in the URL display window of your web browser. Certain advertising services or third-party content
                                    providers may associate these search strings with cookies they set or retrieve from our pages.
                                </p>
                                <p>
                                    Please see our <a href="terms#cookies">Cookies Policy</a> for more information about how Scener and our business
                                    partners use cookies and similar technologies.
                                </p>
                            </li>
                            <li>
                                Third Party websites
                                <p>
                                    A variety of third-party websites that are accessible through our Services are not subject to this Privacy Policy.
                                    Such third-party websites—including social media websites, additional third-party plug-ins, and advertisements,
                                    are not under our control and operate under their own policies and procedures. Therefore, if you click on a link
                                    to access a third-party website, you may be subject to a third party’s policies on the collection and use of your
                                    personal information. We encourage you to review the privacy policies of these third-party websites to inform
                                    yourself of their policies and practices regarding your personal information.{" "}
                                </p>
                            </li>
                            <li>
                                How Long Do We Retain Personal Information?
                                <p>
                                    We retain personal information only as long as necessary to fulfill the purposes described in this Privacy Policy,
                                    such as providing the Services and fulfilling the transactions you have requested, or for other essential purposes
                                    such as complying with our legal obligations, resolving disputes, and enforcing our agreements, after which the
                                    information will be deleted or de-identified. Your content will be deleted from our Services when you remove
                                    content from our Services or five years from your last interaction with our Service, whichever occurs first,
                                    although certain de-identified or aggregated data derived from it may be retained for limited purposes such as
                                    product improvement.
                                </p>
                            </li>
                            <li>
                                Accessing and Correcting Your Information
                                <p>
                                    You can review and change your personal information, and opt out of receiving marketing emails, by logging into
                                    the Services and visiting your account profile page.{" "}
                                </p>
                                <p>
                                    If you delete your content from our Services, copies of your content may remain viewable in cached and archived
                                    pages, or might have been copied or stored by other users of our Services.
                                </p>
                                <p>
                                    Please also refer to the{" "}
                                    <a href="#contact">
                                        {"'"}Contact Information{"'"}
                                    </a>{" "}
                                    section for additional ways of contacting us.
                                </p>
                            </li>
                            <li>
                                California Privacy Rights
                                <p>
                                    If you are a California resident and the processing of personal information about you is subject to the California
                                    Consumer Privacy Act (CCPA), you have certain rights with respect to that information.
                                </p>
                                <p>
                                    Those rights include a {"“"}right to know{"”"} which allows you to request that we disclose to you the personal
                                    information we collect and details about how we collect, use, and disclose that information. Note that much of
                                    that information is provided in this Privacy Policy, including in the below table which provides you a summary of
                                    our data collection, use and sharing practices by data category for the preceding 12 months. Please note that this
                                    information supplements the information provided in the sections above.{" "}
                                </p>
                                <p>
                                    California residents also have a right to request that we delete personal information under certain circumstances,
                                    subject to several exceptions.
                                </p>
                                <p>
                                    California residents have the right to opt-out from future {"“"}sales{"”"} of personal information. Note that the
                                    CCPA defines {"“"}sell{"”"} and {"“"}personal information{"”"} very broadly such that making personal information
                                    available to third-party advertising companies can be considered a {"“"}sale{"”"} in some circumstances. While we
                                    made such information regarding California residents available to advertising companies in the preceding 12
                                    months, as described in the
                                    {"“"}when and how do we share personal information with third parties?{"”"} section of this Policy, we do not
                                    currently do so and thus do not currently {"“"}sell{"”"} information related to California residents.
                                </p>
                                <p>
                                    To exercise the right to know or the right to request deletion, please refer to the {"“"}how to access, update and
                                    delete your personal information{"”"} section. California residents also have the right to not be discriminated
                                    against if they choose to exercise any of the above rights.
                                </p>
                                <ul style={{ fontSize: "small" }}>
                                    <li>
                                        <strong>Identifiers</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                We collect this category primarily when you register for the services or interact with our service. We
                                                may also get certain identifiers from third parties such as social network services. Information in
                                                this category includes name, email address, Internet Protocol address, or postal address.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To contact you, enable the use of our services, and to understand how you interact with our products
                                                and services.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers – to obtain support services such as credit card processing (where applicable), data
                                                processing and secure data storage services.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Personal information under California Civil Code section 1798.80</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                Information in this category includes any information that is linked or linkable to an individual. We
                                                collect this category from our users and third-party partners.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To enable the use of our services and enhance the user experience.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers – to obtain support services.
                                                <br />
                                                Analytics Providers – to better understand your use of the services.
                                                <br />
                                                Third Party Partners – to provide additional products and services that can be added onto our
                                                products.
                                                <br />
                                                Advertising Companies – Currently we do not permit our advertising partners to serve personalized
                                                advertisements to California residents.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Commercial information</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                We collect this category from you when you make purchases. Information in this category includes
                                                credit card numbers and purchase history.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To provide you access to the service, where applicable.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers - to process payments
                                                <br />
                                                Analytics Providers – to better understand your use of our products and services
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Internet or other electronic network activity information</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                We collect this category when you interact with our website and other products and services.
                                                Information in this category includes browser type, time and date of visit to our website or other
                                                information relating to your interaction with our website or application.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To enable the use of our products and services, to understand how our users interact with products and
                                                services.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers and Analytics Partners.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Geolocation Data</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                We collect this category from our users when you interact with our products and services. We may also
                                                obtain this information from our service providers when we validate your location.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To offer localized products and services and also offer certain functionalities such as image
                                                indexing.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers and Analytics Partners.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Inferences</strong>
                                        <ul>
                                            <li>
                                                <i>Category &amp; Source of personal information</i>
                                                <br />
                                                We create these internally from our user interactions.
                                            </li>
                                            <li>
                                                <i>How we use it</i>
                                                <br />
                                                To provide you services and enhance your user experience.
                                            </li>
                                            <li>
                                                <i>When and why we share it with third parties</i>
                                                <br />
                                                Service Providers - only to obtain secure data processing and data storage services.
                                                <br />
                                                Certain advertising companies can create their own profiles using cookies and other tracking
                                                techniques when they serve ads on our properties. We currently do not offer personalized
                                                advertisements in California and do not expose personal information to advertising companies.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                Changes to Our Privacy Policy
                                <p>
                                    We revise this Privacy Policy as needed to keep it up-to-date with Services. When we do, we will update the date
                                    at the top of this Privacy Policy. If we make any material changes we will notify you by email (sent to the email
                                    address specified in your account, if relevant) or by means of a notice on this page. We encourage you to
                                    periodically review this page for the latest information on our privacy practices.
                                </p>
                            </li>
                            <a className={"anchor"} name="contact" id="contact"></a>
                            <li>
                                Contact Information
                                <p>To ask questions or comment about this Privacy Policy and our privacy practices, contact us at:</p>
                                <p>
                                    Privacy Policy Group <br />
                                    Scener, Inc.
                                    <br />
                                    999 3rd Ave, Suite 3300
                                    <br />
                                    Seattle, WA 98104 USA
                                    <br />
                                </p>
                                <p>
                                    Alternatively, you can email us at <a href="mailto:hello@scener.com">hello@scener.com</a>.
                                </p>
                            </li>
                        </ol>

                        <a className={"anchor"} name="community_guidelines" id="community_guidelines"></a>
                        <h2>Scener Community Guidelines</h2>
                        <p>Last updated: September 10, 2019</p>
                        <p>
                            To foster an environment for creative expression, your use of Scener is governed by these {"“"}Community Guidelines.{"”"}{" "}
                            The Community Guidelines identify activities that you are encouraged to do and activities you are prohibited from doing,
                            and explain the reporting system. Capitalized terms not defined herein are defined in Scener’s{" "}
                            <a a href="#tos">
                                Terms of Use
                            </a>
                            .
                        </p>
                        <p>
                            To help maintain a friendly, positive user experience, you are encouraged to report users who violate these Community
                            Guidelines. Failure to abide by these Community Guidelines is a violation of the Terms of Use which may result in the
                            termination of your access to the Services.
                        </p>
                        <h3>1. User Contributions</h3>
                        <p>
                            Users may contribute to the Service through text, graphics, photos, sounds, music, videos, comments and other materials (
                            {"“"}Content{"”"}) which you may view or access through the Service. If enough users report Content the Content will be
                            automatically removed from Scener. We may review the removed Content to confirm whether it violates these Community
                            Guidelines and may, at our discretion, restore Content. We also have discretion to remove Content that we think violate
                            these Community Guidelines.
                        </p>
                        <h3>2. Content Standards</h3>
                        <p>
                            Content must comply with all applicable federal, state, local and international laws and regulations. Without limiting the
                            foregoing, Content must not:
                        </p>
                        <ul>
                            <li>
                                Contain any material which is defamatory, obscene, indecent, threatening, abusive, offensive, harassing, violent,
                                hateful, inflammatory or otherwise objectionable;
                            </li>
                            <li>
                                Promote sexually explicit or pornographic material, violence, or discrimination based on race, sex, religion,
                                nationality, disability, sexual orientation, gender identification, gender presentation, or age;
                            </li>
                            <li>Infringe any patent, trademark, trade secret, copyright or other property rights of any other person;</li>
                            <li>
                                Violate legal rights (including the rights of publicity and privacy) of others or contain any material that could give
                                rise to any civil or criminal liability under applicable laws or regulations or that otherwise may be in conflict with
                                the <a href="#tos">Terms of Use</a> and our <a href="#privacy">Privacy Policy</a>;
                            </li>
                            <li>Promote any illegal activity, or advocate, promote or assist any unlawful act;</li>
                            <li>Misrepresent your identity or affiliation with any person or organization in a way that would mislead others;</li>
                            <li>
                                Involve commercial activities or sales that are not expressly permitted by us, such as contests, sweepstakes and other
                                sales promotions, barter or advertising;
                            </li>
                            <li>
                                Give the impression that they emanate from or are endorsed by us or any other person or entity, if this is not the
                                case.
                            </li>
                        </ul>
                        <h3>3. Prohibited Uses</h3>
                        <p>You are prohibited from accessing and using the Services:</p>
                        <ul>
                            <li>In any way that violates any applicable federal, state, local or international law or regulation;</li>
                            <li>
                                For the purpose of exploiting, harming or attempting to exploit or harm minors in any way by exposing them to
                                inappropriate content or asking for personally identifiable information;
                            </li>
                            <li>
                                To transmit, or procure the sending of, any advertising or promotional material without our prior written consent,
                                including any junk mail, chain letter, or spam or any other similar solicitation, in whatever form;
                            </li>
                            <li>
                                To impersonate or attempt to impersonate us, a Scener employee, another user or any other person or entity (including,
                                without limitation, by using e-mail addresses or screen names associated with any of the foregoing);
                            </li>
                            <li>
                                To engage in any other conduct that restricts or inhibits anyone{"'"}s use or enjoyment of the Services, or which, as
                                determined by us, may harm us or users of the Services, including but not limited to {"“"}cyberbullying,{"”"} or
                                expose them to liability;
                            </li>
                            <li>
                                For commercial purposes, including but not limited to an ad-based revenue scheme or a component of a commercial
                                website or service;
                            </li>
                            <li>
                                In any manner that could disable, overburden, damage, or impair the Services, or interfere with anyone’s use of the
                                same, including their ability to engage in real time activities through the Services;
                            </li>
                            <li>
                                Use any robot, spider or other automatic device, process or means to access the Services for any purpose, including
                                monitoring or copying any of the material on the Services;
                            </li>
                            <li>
                                Use any manual process to monitor or copy any of the material on the Services for any unauthorized purpose without our
                                prior written consent;
                            </li>
                            <li>Use any device, software or routine that interferes with the proper working of the Services;</li>
                            <li>
                                Introduce any viruses, Trojan horses, worms, logic bombs or other material which is malicious or technologically
                                harmful;
                            </li>
                            <li>
                                Attempt to gain unauthorized access to, interfere with, damage or disrupt any parts of the Services, the server on
                                which the Services are stored, or any server, computer or database connected to the Services;{" "}
                            </li>
                            <li>Attack the Services via a denial-of-service attack;</li>
                            <li>Otherwise attempt to interfere with the proper working of the Services.</li>
                        </ul>
                        <h3>4. Violations of Community Guidelines</h3>
                        <p>
                            If you feel a user is violating these Community Guidelines, you should report them to us by sending an email to:{" "}
                            <a href="mailto:hello@scener.com">hello@scener.com</a>.{" "}
                        </p>
                        <h3>5. Copyright Infringement </h3>
                        <p>
                            If you are a copyright owner or an agent thereof and believe that any Content on the Service infringes upon your
                            copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ({"“"}DMCA{"”"}) by following
                            the procedure set out in our Terms of Service.{" "}
                        </p>

                        <a className={"anchor"} name="cookies" id="cookies"></a>
                        <h3>Cookie Policy</h3>
                        <p>Last modified: December 31, 2019</p>
                        <p>
                            Like many web sites, Scener and our business partners use cookies and similar technologies operate our websites and
                            services, and to provide you with a tailored experience. A {"“"}cookie{"“"} is a small text file that is stored by your
                            web browser on your computer or mobile device. When you visit our websites and use our products and services, Scener
                            cookies are sent to our servers automatically.
                        </p>
                        <p>
                            Cookies allow our website and online services to {"“"}recognize{"“"} your device and to display information that is
                            relevant to you. When you return to Scener websites your settings are maintained and we can personalize content, banners,
                            advertisements and promotions that you will see when you visit Scener websites and use Scener Services. These technologies
                            also enable us to cache some elements of the Scener Services to improve their performance. The following describes the
                            types of cookies we use:
                        </p>

                        <h4>Functional</h4>
                        <p>
                            To recognize our users{"'"} preferences (last item viewed, preferred startup page etc.) and remembering subscribers{"'"}{" "}
                            and registered account holders{"'"} information such as username or ID.{" "}
                        </p>

                        <h4>Advertising</h4>
                        <p>
                            These are placed by Scener or our partners for advertising purposes. Upon your return to our websites, we can personalize
                            advertisements and promotions.
                        </p>

                        <h4>Analytics</h4>
                        <p>
                            To develop aggregated statistics about how visitors use our websites, including the number of visitors to the site, where
                            visitors come from, and the pages they visited. These cookies help us understand traffic patterns on Scener websites so
                            that we can improve our customers’ experience and provide make it easier to find relevant content and information.
                        </p>

                        <p>
                            In order to opt out from cookie collection, please use a browser capable of this setting. These settings are typically
                            found in the options or preferences menu in your browser. You can also use plugins to help you preserve your opt out
                            cookies. For more information, please visit <a href="http://www.aboutads.info/PMC">About Ads</a>. Scener does not require
                            that you accept cookies, however, some functionality on our websites, products, and services will be impaired if you
                            decline to accept cookies.{" "}
                        </p>
                        <p>
                            Any personal information that we gather by, or store in, our cookies is treated in accordance with this and our Privacy
                            Policy.
                        </p>
                    </div>
                </section>
            </Section>
        </Page>
    );
}

export default withAppState(TermsPage);
