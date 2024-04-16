import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
    const { data } = useData();
    const [index, setIndex] = useState(0);
    const byDateDesc = data?.focus.sort((evtA, evtB) =>
        new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
    );

    // Modification de la fonction nextCard pour lui passer l'index courant et les événements en paramètres
    const nextCard = (currentIndex, events) =>
        setTimeout(
            () =>
                setIndex(
                    currentIndex < events.length - 1 ? currentIndex + 1 : 0
                ),
            5000
        );

    useEffect(() => {
        // Ajout d'un identifiant de minuterie pour pouvoir l'effacer lorsque le composant est re-rendu
        // Mise à jour du code pour stocker l'identifiant de la minuterie retourné par nextCard dans une variable timerId
        const timerId = nextCard(index, byDateDesc);

        // Ceci effacera la minuterie lorsque le composant sera re-rendu
        return () => clearTimeout(timerId);
    }, [index, byDateDesc]);

    return (
        <div className="SlideCardList">
            {byDateDesc?.map((event, idx) => (
                <div key={event.title}>
                    <div
                        className={`SlideCard SlideCard--${
                            index === idx ? "display" : "hide"
                        }`}
                    >
                        <img src={event.cover} alt="forum" />
                        <div className="SlideCard__descriptionContainer">
                            <div className="SlideCard__description">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div>{getMonth(new Date(event.date))}</div>
                            </div>
                        </div>
                    </div>
                    <div className="SlideCard__paginationContainer">
                        <div className="SlideCard__pagination">
                            {byDateDesc.map((_, radioIdx) => (
                                <input
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={radioIdx}
                                    type="radio"
                                    readOnly
                                    name="radio-button"
                                    checked={index === radioIdx}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Slider;
