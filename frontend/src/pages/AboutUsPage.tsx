import SimpleHero from "../components/SimpleHero";
import { LuUserRound, LuBriefcase, LuGlobe  } from "react-icons/lu";

const AboutUsPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <SimpleHero heading="About CoCreate" subheading="Connecting talented individuals to collaborate on meaningful projects and build their future together."/>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>

                        <p className="text-lg text-gray-700 mb-8">
                            At CoCreate, we believe that great ideas come to life when the right people connect. Our mission is to create a platform where students and professionals can find remote collaboration opportunities, gain valuable experience, and build impressive portfolios together.
                        </p>
                            <p className="text-lg text-gray-700">
                            We're focused on breaking down barriers to entry in fields like Software Development, Computer Science, and Graphic Design by facilitating meaningful connections between those seeking experience and those with projects that need talented contributors.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto px-20">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Community First */}
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <LuUserRound className="h-8 w-8 text-purple-800" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community First</h3>
                            <p className="text-gray-600">
                                We believe in the power of community and collaboration. By bringing together diverse talents and perspectives, we create an environment where everyone can learn and grow.
                            </p>
                        </div>

                        {/* Experience Matters */}
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <LuBriefcase className="h-8 w-8 text-purple-800" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Experience Matters</h3>
                            <p className="text-gray-600">
                                We understand that getting that first opportunity can be challenging. We're committed to helping students and newcomers gain practical experience in their fields.
                            </p>
                        </div>

                        {/* Remote Collaboration */}
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <LuGlobe className="h-8 w-8 text-purple-800" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Remote Collaboration</h3>
                            <p className="text-gray-600">
                                We embrace the future of work by enabling remote collaboration.
                                Geography should never be a barrier to working on exciting
                                projects with talented people.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Contact Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

                    <p className="text-lg max-w-2xl mx-auto mb-8">
                        Have questions about CoCreate? We'd love to hear from you!
                    </p>
                    <a href="mailto:contact@cocreate.com" className="bg-navy text-gray-100 px-8 py-4 rounded-md font-semibold hover:bg-gray-800 inline-block">
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    )
};
export default AboutUsPage;