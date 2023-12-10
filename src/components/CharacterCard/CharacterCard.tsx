import React from "react";

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

const CharacterCard: React.FC<CharacterProps> = ({
    character: { image, name },
}) => {
    return (
        <article className="character-card relative w-full h-full rounded-lg overflow-hidden">
            {/* Card Body */}
            <div className="character-card__body w-full h-full bg-white">
                {/* Image display */}
                <div className="character-card__image-wrapper relative w-full pt-[100%] overflow-hidden">
                    <div className="character-card__media absolute top-0 left-0 w-full h-full">
                        <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="character-card__image block w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="character-card__content p-4 md:p-6">
                    {/* Char's name */}
                    <h2 className="character-card__name font-4xl font-bold">
                        {name}
                    </h2>
                </div>
            </div>
        </article>
    );
};

export default CharacterCard;
