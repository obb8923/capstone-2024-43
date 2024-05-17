import React, { useEffect } from 'react';
import  Editor  from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const TextEditor = ({initialData, setData}) => {
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
				'blockQuote',
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

	useEffect(() => {
        setData(initialData);
    }, [initialData, setData]);

    return (
        <CKEditor 
        editor={Editor}
        config={editorConfig}
		data={initialData}
        onChange={(event, editor) => {
            const data = editor.getData();
            setData(data); // setData(data)를 통해 실제로 에디터에서 작성한 내용이 HTML 형식의 문자열로 전달.
        }}
        />
    )
}

export default TextEditor;