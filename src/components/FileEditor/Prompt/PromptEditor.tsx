import PromptInput from '@/components/FileEditor/Prompt/PromptInput';
import Tabs from '@/components/Tab/Tabs';
import TabPane from '@/components/Tab/TabPane';
import '@/components/FileEditor/Prompt/PromptEditor.css';

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