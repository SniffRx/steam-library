import React from 'react';

export const GamePrice = ({details}) => {
    return (
        <>
        {details.game_info.price_overview !== undefined && (
                <div>
                    <h3 className="text-md font-medium text-gray-400">Цена</h3>
                    <p className="text-lg text-white">{details.game_info.price_overview?.final_formatted}</p>
                </div>
            )}
        </>
    )
}
