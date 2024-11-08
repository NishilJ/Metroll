import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import { Provider, defaultTheme, Grid, View } from "@adobe/react-spectrum";
import TransitBar from "../components/TransitBar";
import Routes from '../components/Routes';

const HomePage: React.FC = () => {
    const [isRoutesVisible, setIsRoutesVisible] = useState(false);

    const handleToggleRoutes = () => {
        setIsRoutesVisible((prev) => !prev);
    };

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
                    <TransitBar onRoutesToggle={handleToggleRoutes} />
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="sidebar" />
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="content">
                    {isRoutesVisible && <Routes />}
                </View>
                <View colorVersion={6} borderWidth="thin" backgroundColor="orange-500" gridArea="footer" />
            </Grid>
        </Provider>
    );
};

export default HomePage;
