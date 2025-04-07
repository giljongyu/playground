import { usePdfLib } from "./worker/useWorker";

function App() {
   const worker = usePdfLib()
	return (
		<button onClick={() => {
			console.log('zmfflr')
			worker.loadPdf()
		}}>클릭 </button>
	);
}

export default App;
