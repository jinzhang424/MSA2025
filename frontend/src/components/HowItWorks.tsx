import HowItWorksCard from "./HowItWorksCard"

function HowItWorks() {
    return (
        <div className="h-screen w-full p-16">
            <header className="flex flex-col justify-center items-center space-y-4 text-black">
                <h1 className="text-4xl font-bold">How It Works</h1>
                <h2 className="flex flex-col justify-center items-center text-center text-gray-700">
                    <p>Whether you're looking to gain experience or build your portfolio, Marketeam connects you</p>
                    <p>with the right people for your projects.</p>
                </h2>
            </header>

            <div className="grid grid-cols-3 mt-16">
                <HowItWorksCard stepNum={1} title="Connect With Others" bodyText="Find fellow talents by posting your project idea or browse through available projects that match your skills and interests."/>
                <HowItWorksCard stepNum={2} title="Collaborate Together" bodyText="Brainstorm and create together while building lasting relationships with like minded people in your field or interests."/>
                <HowItWorksCard stepNum={3} title="Create Your Vision" bodyText="Transform your ideas into something tangible. Craft, design, and bring your unique vision to life with intention and creativity."/>
            </div>
        </div>
    )
}

export default HowItWorks
