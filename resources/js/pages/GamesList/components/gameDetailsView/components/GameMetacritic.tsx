import React from 'react';

export const GameMetacritic = ({details}) => {
    return (
        <>
        {details.game_info.metacritic_score && (
                <div>
                    <h3 className="text-md font-medium text-gray-400">Metacritic</h3>
                    <p className="text-lg text-white">{details.game_info.metacritic_score}/100</p>
                </div>
            )}
        </>
    )
}
export default GameMetacritic;
