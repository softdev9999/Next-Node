import { AudioProvider } from "hooks/UserMedia/AudioProvider";
import { SettingsProvider } from "hooks/Settings/Settings";
import { ExtensionProvider } from "hooks/Extension/Extension";
import { MediaProvider } from "hooks/UserMedia/MediaProvider";
import { GlobalAppStateProvider } from "hooks/Global/GlobalAppState";
export default function withAppState(component) {
    return function (props) {
        return (
            <AudioProvider>
                <SettingsProvider>
                    <ExtensionProvider>
                        <MediaProvider>
                            <GlobalAppStateProvider>{React.createElement(component, props)}</GlobalAppStateProvider>
                        </MediaProvider>
                    </ExtensionProvider>
                </SettingsProvider>
            </AudioProvider>
        );
    };
}
