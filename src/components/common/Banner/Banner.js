import { BannerWrapper } from "./Banner.style";

export function Banner({ dateSubmitted }) {
    return (
        <BannerWrapper>{dateSubmitted ? dateSubmitted : "wow"}</BannerWrapper>
    );
}
