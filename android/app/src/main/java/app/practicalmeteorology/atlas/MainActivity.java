package app.practicalmeteorology.atlas;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SystemLanguagesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
