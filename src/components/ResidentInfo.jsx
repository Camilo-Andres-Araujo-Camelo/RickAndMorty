import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ResidentInfo = ({residentEndPoint: url}) => {

    const [character, setCharacter] = useState({})
    const [icon, setIcon] = useState('')
    const [state, setState] = useState('')

    useEffect(()=> {
        axios.get(url)
            .then(res => {
                setCharacter(res.data)
                if(res.data.status === "Alive"){
                    setIcon('circle')
                    setState('green')
                } else if (res.data.status === "Dead") {
                    setIcon('skull')
                    setState('red')
                } else if (res.data.status === "unknown"){
                    setIcon('circle-question')
                    setState('grey')
                }
            })
    }, [])

    return (
            <div>
                <li className='resident'>
                    <img src={character.image} alt="" />
                    <h4 className='H4'>Name: <span>{character.name}</span></h4>
                    <h4 className='H4'>Species: <span>{character.species}</span></h4>
                    <h4 className='H4'>Origin: <span>{character.origin?.name}</span></h4>
                    <h4 className='H4'>Episode appearances: <span>{character.episode?.length}</span></h4>
                    <span className='status'>{character.status} <i className={`fa-solid fa-${icon} ${state}`}></i></span>
                </li>
            </div>
    )
};

export default ResidentInfo;