
export function ChevronRight({fill, width, height, styles, className}) {

    return (
        <svg className={className} fill={fill} enableBackground="new 0 0 185.343 185.343" version="1.1" viewBox="0 0 185.34 185.34" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
		    <path d="m51.707 185.34c-2.741 0-5.493-1.044-7.593-3.149-4.194-4.194-4.194-10.981 0-15.175l74.352-74.347-74.352-74.352c-4.194-4.194-4.194-10.987 0-15.175 4.194-4.194 10.987-4.194 15.18 0l81.934 81.934c4.194 4.194 4.194 10.987 0 15.175l-81.934 81.939c-2.093 2.1-4.84 3.15-7.587 3.15z"/>
        </svg>
   );
};




export function ChevronLeft({fill, width, height, styles, className}) {

    return (
        // <svg xmlns="http://www.w3.org/2000/svg" viewBox="1.5 0.5 8 17">
        //     <path d="M 9 1 L 2 9 L 9 17" stroke="#000000" stroke-width="1" fill="none"/>
        // </svg>
        <svg className={className} fill={fill} enableBackground="new 0 0 185.343 185.343" version="1.1" viewBox="0 0 185.34 185.34" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(-1 0 0 1 185.34 0)">
                <path d="m51.707 185.34c-2.741 0-5.493-1.044-7.593-3.149-4.194-4.194-4.194-10.981 0-15.175l74.352-74.347-74.352-74.352c-4.194-4.194-4.194-10.987 0-15.175 4.194-4.194 10.987-4.194 15.18 0l81.934 81.934c4.194 4.194 4.194 10.987 0 15.175l-81.934 81.939c-2.093 2.1-4.84 3.15-7.587 3.15z"/>	
            </g>
        </svg>
   );
};
