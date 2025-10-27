import React from 'react';

export const GamePrice = ({details}) => {
    return (
        <>
        {details.game_info.price !== undefined && (
                <div>
                    <h3 className="text-md font-medium text-gray-400">Цена</h3>
                    <p className="text-lg text-white">{details.game_info.price}</p>
                </div>
            )}
        </>
    )
}
export default GamePrice;
