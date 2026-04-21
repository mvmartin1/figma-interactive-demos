import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { demoHtml } from './src/demo-html';

const forwardConsoleToRN = `
  (function() {
    const post = (level, args) => window.ReactNativeWebView.postMessage(
      JSON.stringify({ level, message: args.map(a => {
        try { return typeof a === 'string' ? a : JSON.stringify(a); }
        catch (_) { return String(a); }
      }).join(' ') })
    );
    ['log','warn','error','info'].forEach(level => {
      const orig = console[level];
      console[level] = (...args) => { post(level, args); orig.apply(console, args); };
    });
    window.addEventListener('error', e => post('error', [e.message, e.filename + ':' + e.lineno]));
    window.addEventListener('unhandledrejection', e => post('error', ['unhandledrejection', String(e.reason)]));
    true;
  })();
`;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        originWhitelist={['*']}
        source={{ html: demoHtml, baseUrl: 'https://localhost' }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        injectedJavaScriptBeforeContentLoaded={forwardConsoleToRN}
        onMessage={(event) => {
          console.log('[WebView]', event.nativeEvent.data);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
});
