import ReactDOM from 'react-dom';
import { getApp } from './router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(getApp(), document.getElementById('root'));
registerServiceWorker();