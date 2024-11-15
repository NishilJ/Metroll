import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum';
import TransitBar from "../components/TransitBar";
import TripPlanner from '../components/TripPlanner';
import Departures from '../components/Departures';
import Routes from '../components/Routes';


// Nishil and Yoel
// Arranges home page layout using react-spectrum and grid
const HomePage: React.FC = () => {
    const [selectedView, setSelectedView] = useState('planner');

    const renderContent = () => {
        switch (selectedView) {
            case 'departures':
                return <Departures/>; // Load Departures on Click
            case 'routes':
                return <Routes/>; // Load Routes on Click
            case 'planner':
            default:
                return null;  // Do not render anything here, as TripPlanner is already in the sidebar
        }
    };


    return (
        <Provider theme={defaultTheme}>
            <Grid
                areas={[
                    'header header',
                    'subheader subheader',
                    'sidebar content',
                    'footer  footer'
                ]}
                columns={['1fr', '2fr']}
                rows={['size-1000', "size-1000", '1fr', 'size-1000']}
                height="100vh"
                gap="size-0"
            >
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="header">
                    <TopNavBar />
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="subheader">
                    <TransitBar onSelect={setSelectedView} />
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="sidebar">
                    {/* Sidebar can contain additional content if needed */}
                    {selectedView === 'planner' && <TripPlanner />}
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="content">
                    {/* Load content to be clicked */renderContent()}
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="footer" />
            </Grid>
        </Provider>
    );
}

export default HomePage;

