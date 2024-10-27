import React from 'react';
import TopNavBar from './Components/TopNavBar';
import {Provider, defaultTheme, Grid, View} from "@adobe/react-spectrum";
import TransitBar from "./Components/TransitBar";

function Home() {
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
                <View colorVersion={6} borderWidth="thin"  backgroundColor="orange-500" gridArea="header">
                    <TopNavBar />
                </View>
                <View colorVersion={6} borderWidth="thin"  backgroundColor="orange-500" gridArea="subheader">
                    <TransitBar />
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="sidebar" />
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="content" />
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="footer" />
            </Grid>
        </Provider>
    );
}

export default Home;
