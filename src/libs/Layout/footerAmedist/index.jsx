import { cssNormalizeSize } from "../../cssNormalizeSize";
import { S } from "./_styled";

const FooterAmedist = ({ minHeight = "100vh", logo, links, credit, ...rest }) => (
    <S.container {...rest} $minHeight={cssNormalizeSize(minHeight)}>
        <S.logoArea data-slot="logo-area">{logo}</S.logoArea>
        <S.linksArea data-slot="links-area">{links}</S.linksArea>
        <S.creditArea data-slot="credit-area">{credit}</S.creditArea>
    </S.container>
);

FooterAmedist.displayName = "Layout.footerAmedist";

export default FooterAmedist;
