import PromptInput from './PromptInput';
import Tabs from '../../Tab/Tabs';
import TabPane from '../../Tab/TabPane';
import './PromptEditor.css';

export default function PromptEditor() {
    return (
        <div className='prompt-editor'>
            <PromptInput />
            <div>
                <Tabs>
                    <TabPane title="Interrogators">
                        <div>Interrogators</div>
                    </TabPane>
                    <TabPane title="My tags">
                        <div>My tags</div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}