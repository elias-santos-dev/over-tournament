// src/components/DeletePlayerModal.tsx
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmModal from "./Modal";
import { Colors } from "../theme/tokens/colors";
import { usePlayerStore } from "../store";

type Props = {
	playerId: string | null;
	visible: boolean;
	onClose: () => void;
	message?: string;
};

export default function DeletePlayerModal({
	playerId,
	visible,
	onClose,
	message = "Tem certeza que deseja remover este jogador?",
}: Props) {
	const { removePlayer } = usePlayerStore();

	const handleConfirm = () => {
		if (playerId) {
			removePlayer(playerId);
			onClose();
		}
	};

	return (
		<ConfirmModal
			visible={visible}
			title="Remover jogador"
			message={message}
			confirmLabel="Remover"
			cancelLabel="Cancelar"
			onConfirm={handleConfirm}
			onCancel={onClose}
			icon={
				<MaterialCommunityIcons
					name="alert-circle-outline"
					size={48}
					color={Colors.status.warning}
				/>
			}
		/>
	);
}
