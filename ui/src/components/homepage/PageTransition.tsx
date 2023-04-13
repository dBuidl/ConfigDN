export default function PageTransition(props: { class?: string }) {
    return <div className={`page-transition ${props.class}`}>
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 500 100">
            <path d="M0,0 L250,100 L500,0" fill="currentColor"/>
        </svg>
    </div>;
}