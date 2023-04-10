import PromptInput from '@/components/FileEditor/Prompt/PromptInput';
import Tabs from '@/components/Tab/Tabs';
import TabPane from '@/components/Tab/TabPane';
import '@/components/FileEditor/Prompt/PromptEditor.css';
import { DatasetFile } from '@/types/file';

type PromptEditorProps = {
    selectedFile: DatasetFile;
    isLoading: boolean;
};

export default function PromptEditor(props: PromptEditorProps) {
    return (
        <div className='prompt-editor'>
            <PromptInput prompt={props.selectedFile.info?.prompt} />
            <div>
                <Tabs>
                    <TabPane title="Interrogators">
                        <ul>
                            {props.selectedFile.info?.tags.map(((item, _) => (
                                <li key={`${item.interrogatorName}-${item.tag}`}>{item.tag} ({item.value.toFixed(2)})</li>
                            )))}
                        </ul>
                    </TabPane>
                    <TabPane title="My tags">
                        <div>My tags</div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}