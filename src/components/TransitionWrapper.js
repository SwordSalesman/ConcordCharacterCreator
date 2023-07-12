import { Transition } from "@headlessui/react";

function TransitionWrapper({ show, enter, leave, children }) {
    return (
        <Transition
            show={show}
            enter={enter && "transition duration-200 ease-out"}
            enterFrom={enter && "transform scale-95 opacity-0"}
            enterTo={enter && "transform scale-100 opacity-100"}
            leave={leave && "transition duration-150 ease-out"}
            leaveFrom={leave && "transform scale-100 opacity-100"}
            leaveTo={leave && "transform scale-95 opacity-0"}
        >
            {children}
        </Transition>
    );
}

export default TransitionWrapper;
