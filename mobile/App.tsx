import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react';
import { demoHtml } from './src/demo-html';

const forwardConsoleToRN = `
  (function() {
    const post = (level, args) => {
      try {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ level, message: args.map(a => {
              try { return typeof a === 'string' ? a : JSON.stringify(a); }
              catch (_) { return String(a); }
            }).join(' ') })
          );
        }
      } catch (_) {}
    };
    ['log','warn','error','info'].forEach(function(level) {
      var orig = console[level];
      console[level] = function() {
        var args = Array.prototype.slice.call(arguments);
        try { post(level, args); } catch(_) {}
        orig.apply(console, args);
      };
    });
    window.addEventListener('error', function(e) {
      post('error', [e.message, (e.filename || '') + ':' + e.lineno]);
    });
    window.addEventListener('unhandledrejection', function(e) {
      post('error', ['unhandledrejection', String(e.reason)]);
    });
    true;
  })();
`;

export default function App() {
  const [webViewError, setWebViewError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      {webViewError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>WebView error: {webViewError}</Text>
        </View>
      ) : null}
      <WebView
        originWhitelist={['*']}
        source={{ html: demoHtml, baseUrl: 'https://localhost' }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        injectedJavaScriptBeforeContentLoaded={forwardConsoleToRN}
        onMessage={(event) => {
          try {
            const msg = JSON.parse(event.nativeEvent.data);
            console.log(`[WebView ${msg.level}]`, msg.message);
          } catch (_) {
            console.log('[WebView]', event.nativeEvent.data);
          }
        }}
        onError={(e) => {
          const desc = e.nativeEvent.description;
          console.error('[WebView onError]', desc);
          setWebViewError(desc);
        }}
        onHttpError={(e) => {
          console.error('[WebView HTTP]', e.nativeEvent.statusCode, e.nativeEvent.url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  webview: { flex: 1 },
  errorBox: { backgroundColor: '#fee', padding: 12 },
  errorText: { color: '#c00', fontSize: 12 },
});
