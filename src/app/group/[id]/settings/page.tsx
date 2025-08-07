'use client';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import PageLoader from '@/components/common/PageLoader';
import StateDisplay from '@/components/common/StateDisplay';
import GroupActions from '@/components/group/GroupActions';
import GroupBasicSettings from '@/components/group/GroupBasicSettings';
import GroupHeader from '@/components/group/GroupHeader';
import GroupInfo from '@/components/group/GroupInfo';
import GroupMemberList from '@/components/group/GroupMemberList';
import GroupMemberManagement from '@/components/group/GroupMemberManagement';
import { GROUP_VALIDATION_MESSAGES } from '@/config/constants';
import { useBanMember, useDeleteGroup, useLeaveGroup, useTransferOwnership, useUpdateGroup } from '@/hooks/group/useGroupSettings';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useTheme } from '@/hooks/ui/useTheme';
import { UpdateGroupFormData, updateGroupSchema } from '@/schemas/groupSchema';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Crown, Trash2, UserMinus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


export default function GroupSettingsPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const params = useParams();
  const currentUser = useCurrentUserData();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [showTransferDialog, setShowTransferDialog] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Group.GroupUserInfo | null>(null);
  const [banReason, setBanReason] = React.useState('');
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 권한 확인 - 그룹장만 접근 가능
  const isGroupOwner = groupDetail && currentUser && groupDetail.owner.userId === currentUser.id;

  // 초대 코드 복사 함수
  const copyInviteCode = () => {
    const textToCopy = groupDetail?.password || 'No password required';
    navigator.clipboard.writeText(textToCopy);
    toast.success('Invite code copied to clipboard!');
  };

  // Group mutations
  const updateGroupMutation = useUpdateGroup(groupId);
  const deleteGroupMutation = useDeleteGroup(groupId);
  const banMemberMutation = useBanMember(groupId);
  const leaveGroupMutation = useLeaveGroup(groupId);
  const transferOwnershipMutation = useTransferOwnership(groupId);

  const form = useForm<UpdateGroupFormData>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: '',
      isPublic: true,
      tags: [],
    },
  });

  const { reset } = form;

  // 그룹 데이터로 폼 초기화
  React.useEffect(() => {
    if (groupDetail) {
      reset({
        name: groupDetail.name,
        isPublic: groupDetail.isPublic,
        tags: groupDetail.tags,
      });
    }
  }, [groupDetail, reset]);

  // Validation error handler
  const onError = (errors: any) => {
    // Show validation error toast with specific messages
    if (errors.name) {
      toast.error(`Group Name: ${errors.name.message}`);
      return;
    }
    if (errors.description) {
      toast.error(`Description: ${errors.description.message}`);
      return;
    }
    if (errors.groundRules) {
      toast.error(`Ground Rules: ${errors.groundRules.message || GROUP_VALIDATION_MESSAGES.GROUND_RULES.EMPTY}`);
      return;
    }
    if (errors.tags) {
      toast.error(`Tags: ${errors.tags.message}`);
      return;
    }
  };

  // Form submit handler for valid data
  const onValidSubmit = async (values: UpdateGroupFormData) => {
    await onSubmit(values);
  };

  // Form submit handler
  const onSubmit = async (values: UpdateGroupFormData) => {
    if (!groupDetail) return;

    const request: Group.UpdateGroupApiRequest = {
      name: values.name,
      description: values.description || groupDetail.description,
      groundRule: values.groundRules 
        ? values.groundRules.filter(rule => rule.trim().length > 0).join('\n')
        : groupDetail.groundRule,
      tags: values.tags,
      isPublic: values.isPublic,
    };

    try {
      await updateGroupMutation.mutateAsync(request);
      // 성공 시 토스트는 mutation의 onSuccess에서 처리됨
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async () => {
    try {
      await deleteGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 멤버 추방 핸들러
  const handleBanMember = async (reason?: string) => {
    if (!selectedMember || !reason?.trim()) return;
    
    try {
      await banMemberMutation.mutateAsync({
        userId: selectedMember.userId,
        reason: reason.trim(),
      });
      setShowBanDialog(false);
      setSelectedMember(null);
      setBanReason('');
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 탈퇴 핸들러 (멤버용)
  const handleLeaveGroup = async () => {
    try {
      await leaveGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 소유권 이전 핸들러
  const handleTransferOwnership = async () => {
    if (!selectedMember) return;
    
    try {
      await transferOwnershipMutation.mutateAsync(selectedMember.userId);
      setShowTransferDialog(false);
      setSelectedMember(null);
    } catch (error) {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLoader message="Loading group information..." />
    );
  }

  // Error state
  if (error || !groupDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <StateDisplay 
          type="error" 
          title="Failed to load group information"
          message="Please check your network connection or try again later."
          onRetry={() => refetch()}
          retryText="Retry"
        />
      </div>
    );
  }


  // 그룹장이 아닌 경우 멤버 전용 페이지 표시
  if (!isGroupOwner) {
    return (
      <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
        {/* 헤더 */}
        <GroupHeader 
          groupName={groupDetail.name}
          isPublic={groupDetail.isPublic}
          password={groupDetail.password}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 그룹 정보 및 멤버 목록 */}
          <GroupMemberList 
            owner={groupDetail.owner}
            members={groupDetail.members}
            currentUserId={currentUser?.id}
            description={groupDetail.description}
            groundRule={groupDetail.groundRule}
            tags={groupDetail.tags}
          />

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <GroupInfo 
              totalMembers={groupDetail.members.length}
              createdAt={groupDetail.createdAt}
            />

            <GroupActions 
              isOwner={false}
              groupName={groupDetail.name}
              onLeaveGroup={() => setShowDeleteDialog(true)}
            />
          </div>
        </div>

        {/* 탈퇴 확인 다이얼로그 */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Leave Group"
          description={
            <>
              Are you sure you want to leave <span className="font-semibold">"{groupDetail?.name}"</span>?
              <br className="mt-2" />
              You can rejoin later if the group is public or if you receive another invitation.
            </>
          }
          confirmText="Leave Group"
          cancelText="Cancel"
          onConfirm={handleLeaveGroup}
          variant="destructive"
          isLoading={leaveGroupMutation.isPending}
          loadingText="Leaving..."
          icon={UserMinus}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <GroupHeader 
        groupName={groupDetail.name}
        isPublic={groupDetail.isPublic}
        password={groupDetail.password}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <GroupBasicSettings 
            form={form}
            onSubmit={onValidSubmit}
            onError={onError}
            isSubmitting={form.formState.isSubmitting || updateGroupMutation.isPending}
            excludeFromValidation={groupDetail?.name}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <GroupMemberManagement 
            owner={groupDetail.owner}
            members={groupDetail.members}
            currentUserId={currentUser?.id}
            onTransferOwnership={(member) => {
              setSelectedMember(member);
              setShowTransferDialog(true);
            }}
            onBanMember={(member) => {
              setSelectedMember(member);
              setShowBanDialog(true);
            }}
          />

          <GroupInfo 
            totalMembers={groupDetail.members.length}
            createdAt={groupDetail.createdAt}
          />

          <GroupActions 
            isOwner={true}
            groupName={groupDetail.name}
            onDeleteGroup={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Group"
        description={
          <>
            Are you sure you want to delete <span className="font-semibold">"{groupDetail?.name}"</span>?
            <br className="mt-2" />
            This action cannot be undone. All group data, including member information and history, will be permanently removed.
          </>
        }
        confirmText="Delete Group"
        cancelText="Cancel"
        onConfirm={handleDeleteGroup}
        variant="destructive"
        isLoading={deleteGroupMutation.isPending}
        loadingText="Deleting..."
        icon={Trash2}
      />

      {/* 멤버 추방 다이얼로그 */}
      <ConfirmDialog
        open={showBanDialog}
        onOpenChange={(open) => {
          setShowBanDialog(open);
          if (!open) {
            setSelectedMember(null);
            setBanReason('');
          }
        }}
        title="Remove Member"
        description={
          <>
            Remove <span className="font-semibold">{selectedMember?.nickname}</span> from the group?
          </>
        }
        confirmText="Remove Member"
        cancelText="Cancel"
        onConfirm={handleBanMember}
        onCancel={() => {
          setSelectedMember(null);
          setBanReason('');
        }}
        variant="destructive"
        isLoading={banMemberMutation.isPending}
        loadingText="Removing..."
        icon={UserMinus}
        showTextarea={true}
        textareaLabel="Reason for removal"
        textareaPlaceholder="Please provide a reason for removing this member..."
        textareaRequired={true}
        textareaValue={banReason}
        onTextareaChange={setBanReason}
      />

      {/* 소유권 이전 다이얼로그 */}
      <ConfirmDialog
        open={showTransferDialog}
        onOpenChange={(open) => {
          setShowTransferDialog(open);
          if (!open) {
            setSelectedMember(null);
          }
        }}
        title="Transfer Group Ownership"
        description={
          <>
            Are you sure you want to transfer ownership of <span className="font-semibold">"{groupDetail?.name}"</span> to <span className="font-semibold">{selectedMember?.nickname}</span>?
            <br className="mt-2" />
            <span className="text-amber-600 font-medium">Warning:</span> You will lose all administrative privileges and cannot undo this action. The new owner will have full control over the group.
          </>
        }
        confirmText="Transfer Ownership"
        cancelText="Cancel"
        onConfirm={handleTransferOwnership}
        onCancel={() => {
          setSelectedMember(null);
        }}
        variant="default"
        isLoading={transferOwnershipMutation.isPending}
        loadingText="Transferring..."
        icon={Crown}
      />
    </div>
  );
}

