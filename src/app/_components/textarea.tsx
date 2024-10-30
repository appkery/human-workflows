'use client'

import { type EditorState, type LexicalEditor,type SerializedEditorState } from 'lexical'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import Editor from '~/app/_components/editor'
import { updatePost } from '~/server/actions/updatePost'
import { classNames } from '~/shared'

const initialState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'

export default function Textarea({
  buttonLabel,
  isEditable,
  userId,
  postDate,
  textareaContent,
}: {
  buttonLabel: string
  isEditable: boolean
  userId: string
  postDate: string
  textareaContent?: SerializedEditorState
}) {
  const [content, setContent] = useState(textareaContent)
  const editorRef = useRef<LexicalEditor | null>(null)

  useEffect(() => {
  if (content && editorRef.current) {
    const editorState = editorRef.current.parseEditorState(content)
    editorRef.current.setEditorState(editorState)
  }
  }, [content])

  const onSubmit = (editorState: EditorState | undefined) => {
    const editorStateJSON = editorState?.toJSON()
    setContent(editorStateJSON)
  }

  const updatePostBinded = updatePost.bind(null, postDate)
  const [formState, formAction] = useFormState(updatePostBinded, [
    {
      path: [],
      message: '',
    },
  ])

  const { pending } = useFormStatus()

  return (
    <div className='mt-6 flex gap-x-3'>
      {buttonLabel === 'Comment' && (
        <Image
          src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          alt=''
          className='h-6 w-6 flex-none rounded-full bg-gray-50'
          width={24}
          height={24}
        />
      )}
      <form className='relative flex-auto' action={formAction}>
        <div
          className={classNames(
            isEditable && 'pb-12',
            buttonLabel === 'Comment' && 'rounded-tl-none',
            'overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'
          )}>
          {buttonLabel === 'Comment' ? (
            <>
              <label htmlFor='content' className='sr-only'>
                Add your comment
              </label>
              <textarea
                rows={2}
                name='content'
                id='content'
                className='block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                placeholder='Add your comment...'
                defaultValue=''
              />
            </>
          ) : (
            <>
              <Editor isEditable={isEditable} ref={editorRef} />
              <input type='hidden' name='content' value={JSON.stringify(content)} />
            </>
          )}
        </div>

        {isEditable && (
          <div className='absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2'>
            <button
              className={classNames(
                buttonLabel === 'Comment'
                  ? 'bg-white px-2.5 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  : 'inline-flex items-center bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                'rounded-md text-sm font-semibold shadow-sm'
              )}
              onClick={e => {
                onSubmit(editorRef.current?.getEditorState())
              }}>
              {buttonLabel}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
