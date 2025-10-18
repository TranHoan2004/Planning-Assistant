import React from 'react';
import {CallToAction} from "@/app/about/components/CallToAction";
import {AwardsAndAchievements} from "@/app/about/components/AwardsAndAchievement";
import Footer from "@/components/layout/Footer";
import {PressAndMedia} from "@/app/about/components/PressAndMedia";
import {HowPlangoWorks} from "@/app/about/components/HowPlangoWorks";
import {OurMissionAndPromise} from "@/app/about/components/OurMissionAndPromise";
import {ThePeopleBehindPlanGo} from "@/app/about/components/ThePeopleBehindPlanGo";
import {AboutUsHeader} from "@/app/about/components/AboutUsHeader";
import {OurJourney} from "@/app/about/components/OurJourney";
import {MissionVision} from "@/app/about/components/MissionVision";
import {CoreValues} from "@/app/about/components/CoreValues";
import {ChatHeader} from "@/components/layout/ChatHeader";
import Sidebar from "@/components/layout/sidebar/Sidebar";

const Page = () => {
    return (
        <div className="flex flex-col h-screen">
            <ChatHeader/>
            <div className="flex flex-grow overflow-hidden">
                <Sidebar/>
                <div className="flex-grow overflow-y-auto">
                    <div className="min-h-screen font-sans">
                        <AboutUsHeader/>
                        <OurJourney/>
                        <MissionVision/>
                        <CoreValues/>
                        <HowPlangoWorks/>
                        <OurMissionAndPromise/>
                        <ThePeopleBehindPlanGo/>
                        <PressAndMedia/>
                        <AwardsAndAchievements/>
                        <CallToAction/>
                        <Footer/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
