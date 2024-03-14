import React, { useEffect, useState } from 'react'

const localData = () => {
    const lists = localStorage.getItem("chat")
    if (lists) {
        return JSON.parse(lists)
    }
    return []
}

const Bot = () => {

    const [myText, setMyText] = useState('')
    const [myChat, setMyChat] = useState(localData)

    const addText = async (e) => {
        e.preventDefault()
        // console.log(myText)
        const newText = { user: 'User', id: new Date().getTime().toString(), text: myText }
        const theText=myText
        setMyText('')
        const updatedChat = [...myChat, newText]
        setMyChat(updatedChat)

        const resp = await fetch('https://emopred-back.vercel.app/emotions', { 
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(theText)
        })

        const res = await resp.json()
        console.log(res.emotion)
        const newReply = { user: 'Bot', id: new Date().getTime().toString(), text: res.emotion }
        setMyChat([...updatedChat, newReply])
    }

    const dateParsed = (myDate) => {
        return myDate.parse()
    }

    useEffect(() => {
        localStorage.setItem("chat", JSON.stringify(myChat))
        const myLastElem = document.getElementById('scrollablediv').lastElementChild
        if (myLastElem) {
            myLastElem.scrollIntoView({ behavior: 'auto', block: 'end' })
        }
    }, [myChat])

    return (
        <>
            <div className='flex flex-col justify-center items-center h-[88vh]'>
                <div className='flex flex-col bg-slate-300 rounded-md w-80 sm:w-96 h-5/6'>
                    <div id='scrollablediv' className='flex flex-col pt-2 max-h-full overflow-y-auto'>
                        {myChat.map((curELem) => {
                            if (curELem.user === 'User') {
                                return (
                                    <div key={curELem.id}>
                                        <div className='bg-green-300 mt-3 mr-3 ml-auto p-2 rounded-b-lg rounded-tl-lg max-w-56 text-black'>{curELem.text}</div>
                                        <div className='mr-3 ml-auto px-2 w-fit text-xs'>{curELem.user}</div>
                                    </div>
                                )
                            }
                            else if (curELem.user === 'Bot') {
                                return (
                                    <div key={curELem.id}>
                                    <div className='bg-blue-300 mt-3 mr-auto ml-3 p-2 rounded-b-lg rounded-tr-lg max-w-56 text-black'>{curELem.text}</div>
                                    <div className='mr-auto ml-3 px-2 w-fit text-xs'>{curELem.user}</div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <form onSubmit={addText} className='flex flex-row items-center mt-auto pb-2'>
                        <input className='m-2 p-2 rounded-md w-11/12 outline-none' type="text" value={myText} placeholder='Enter Text' onChange={(e) => setMyText(e.target.value)} />
                        <button type='submit'>
                            <i className='justify-center items-center bg-blue-400 mr-2 p-3 rounded-md text-white add-btn fa fa-plus'></i>
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Bot