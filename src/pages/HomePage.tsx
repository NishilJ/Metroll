import React, { useState } from 'react';
import TopNavBar from './Components/TopNavBar';
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum';
import TransitBar from "./Components/TransitBar";
import TripPlanner from './Components/TripPlanner';

function Home() {
    const [selectedView, setSelectedView] = useState('planner');

    return (
        <Provider theme={defaultTheme}>
            <Grid
                areas={[
                    'header  header',
                    'subheader  subheader',
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
                    {/* Other content can be placed here */}
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="footer" />
            </Grid>
        </Provider>
    );
}

export default Home;
