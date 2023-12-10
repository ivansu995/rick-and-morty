import React, { memo } from "react";

/** Component's props */

interface CharacterProps {
    character: {
        image: string;
        name: string;
    };
}

/** Character Card component
 * Renders card displaying char's image and name
 *
 * Character object containing props 'image' and 'name'
 */

const CharacterCard: React.FC<CharacterProps> = {};
