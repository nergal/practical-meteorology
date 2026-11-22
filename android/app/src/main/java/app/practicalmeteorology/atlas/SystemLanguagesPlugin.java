package app.practicalmeteorology.atlas;

import android.content.res.Configuration;
import androidx.core.os.ConfigurationCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SystemLanguages")
public class SystemLanguagesPlugin extends Plugin {
    @PluginMethod
    public void getPreferred(PluginCall call) {
        Configuration configuration = getContext().getResources().getConfiguration();
        JSObject result = new JSObject();
        result.put("tags", ConfigurationCompat.getLocales(configuration).toLanguageTags());
        call.resolve(result);
    }

    @Override
    protected void handleOnConfigurationChanged(Configuration newConfig) {
        bridge.triggerWindowJSEvent("atlasConfigurationChanged");
    }
}
