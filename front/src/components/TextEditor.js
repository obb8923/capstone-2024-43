import  Editor  from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const TextEditor = ({setData}) => {
    const editorConfig = {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'|',
				'fontColor',
				'fontFamily',
				'fontSize',
				'|',
				'bulletedList',
				'numberedList',
				'outdent',
				'indent',
				'|',
				'imageUpload',
				'blockQuote',
				'insertTable',
				'|',
				'undo',
				'redo'
			]
		},
		language: 'ko',
		image: {
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
        fontSize: {
            options: [9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // 숫자 값으로 폰트 크기 설정
        }
    };

    return (
        <CKEditor 
        editor={Editor}
        config={editorConfig}
        onChange={(event, editor) => {
            const data = editor.getData();
            setData(data); // setData(data)를 통해 실제로 에디터에서 작성한 내용이 HTML 형식의 문자열로 전달.
        }}
        />
    )
}

export default TextEditor;