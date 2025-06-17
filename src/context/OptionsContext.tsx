@@ .. @@
   // Load data on mount
   useEffect(() => {
     dispatch({ type: 'LOAD_DATA' })
+    
+    // Load environment configuration
+    const updateInterval = parseInt(import.meta.env.VITE_OPTIONS_UPDATE_INTERVAL || '5000')
+    const maxHistoricalDays = parseInt(import.meta.env.VITE_MAX_HISTORICAL_DAYS || '14')
+    
+    console.log(`Options trading initialized with ${updateInterval}ms update interval`)
   }, [])
 
   // Save data to localStorage whenever state changes
@@ .. @@
   // Simulate real-time price updates for options
   useEffect(() => {
+    const updateInterval = parseInt(import.meta.env.VITE_OPTIONS_UPDATE_INTERVAL || '5000')
+    
     const interval = setInterval(() => {
       const updatedContracts = state.contracts.map(contract => {
         // Simulate price movement based on implied volatility
@@ .. @@
       })
       
       dispatch({ type: 'UPDATE_CONTRACT_PRICES', payload: updatedContracts })
-    }, 5000) // Update every 5 seconds
+    }, updateInterval)
     
     return () => clearInterval(interval)
   }, [state.contracts])