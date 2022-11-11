import { TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';

export type FilterStyleProps = {
  isActive?: boolean;
};

export const Container = styled(TouchableOpacity).attrs<FilterStyleProps>(
  ({ theme, activeOpacity }) => ({
    activeOpacity: 0.8,
  })
)<FilterStyleProps>`
  ${({ theme, isActive }) =>
    isActive &&
    css`
      border: 1px solid ${theme.COLORS.GREEN_700};
    `}
  height: 38px;
  width: 70px;
  border-radius: 4px;
  padding: 4px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${theme.FONT_SIZE.SM}px;
    color: ${theme.COLORS.WHITE};
    text-transform: uppercase;
  `}
`;
