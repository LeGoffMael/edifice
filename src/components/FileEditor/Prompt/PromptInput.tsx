import '@/components/FileEditor/Prompt/PromptInput.css';


type PromptInput = {
    prompt: string | undefined;
};

export default function PromptInput(props: PromptInput) {
    // TODO : add highlight words
    return (
        <textarea className="prompt-input" placeholder="Enter prompt...">{props.prompt}</textarea>
    );
}